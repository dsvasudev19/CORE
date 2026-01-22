package com.dev.core.service.performance.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.performance.PerformanceCycle;
import com.dev.core.mapper.performance.PerformanceCycleMapper;
import com.dev.core.model.performance.PerformanceCycleDTO;
import com.dev.core.repository.performance.PerformanceCycleRepository;
import com.dev.core.service.performance.PerformanceCycleService;
import com.dev.core.service.validation.performance.PerformanceCycleValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceCycleServiceImpl implements PerformanceCycleService {

    private final PerformanceCycleRepository cycleRepository;
    private final PerformanceCycleValidator validator;

    @Override
    public PerformanceCycleDTO createCycle(Integer year, Integer quarter, Long organizationId) {
        validator.validateBeforeCreate(year, quarter, organizationId);

        PerformanceCycle existing = cycleRepository.findByYearAndQuarterAndOrganizationId(year, quarter, organizationId)
                .orElse(null);

        if (existing != null) {
            return PerformanceCycleMapper.toDTO(existing);
        }

        PerformanceCycle pc = PerformanceCycle.builder()
                .year(year)
                .quarter(quarter)
                
                .active(true)
                .startedAt(LocalDateTime.now())
                .build();

        pc = cycleRepository.save(pc);
        return PerformanceCycleMapper.toDTO(pc);
    }

    @Override
    @Transactional(readOnly = true)
    public PerformanceCycleDTO getActiveCycle(Long organizationId) {
        return cycleRepository.findByActiveTrueAndOrganizationId(organizationId)
                .stream()
                .findFirst()
                .map(PerformanceCycleMapper::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerformanceCycleDTO> listCycles(Long organizationId) {
        return cycleRepository.findByOrganizationId(organizationId)
                .stream()
                .map(PerformanceCycleMapper::toDTO)
                .toList();
    }

    @Override
    public boolean closeCycle(Long cycleId) {
        if (cycleId == null) return false;
        PerformanceCycle pc = cycleRepository.findById(cycleId).orElse(null);
        if (pc == null) return false;
        pc.setActive(false);
        pc.setEndedAt(LocalDateTime.now());
        cycleRepository.save(pc);
        return true;
    }
}
