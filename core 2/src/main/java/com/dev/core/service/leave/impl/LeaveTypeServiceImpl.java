package com.dev.core.service.leave.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.leave.LeaveType;
import com.dev.core.mapper.leave.LeaveTypeMapper;
import com.dev.core.model.leave.LeaveTypeDTO;
import com.dev.core.model.leave.MinimalLeaveTypeDTO;
import com.dev.core.repository.leave.LeaveTypeRepository;
import com.dev.core.service.leave.LeaveTypeService;
import com.dev.core.service.validation.leave.LeaveTypeValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveTypeServiceImpl implements LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveTypeValidator validator;

    @Override
    public LeaveTypeDTO create(LeaveTypeDTO dto) {
        validator.validateBeforeCreate(dto);

        LeaveType entity = new LeaveType();
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setAnnualLimit(dto.getAnnualLimit());
        entity.setMonthlyLimit(dto.getMonthlyLimit());
        entity.setQuarterlyLimit(dto.getQuarterlyLimit());
        entity.setEarnedLeave(dto.getEarnedLeave());
        entity.setCarryForward(dto.getCarryForward());
        entity.setMaxCarryForward(dto.getMaxCarryForward());

        entity = leaveTypeRepository.save(entity);
        return LeaveTypeMapper.toDTO(entity);
    }

    @Override
    public LeaveTypeDTO update(Long id, LeaveTypeDTO dto) {
        validator.validateBeforeUpdate(id, dto);

        LeaveType entity = leaveTypeRepository.findById(id).orElseThrow();
        entity.setName(dto.getName());
        entity.setAnnualLimit(dto.getAnnualLimit());
        entity.setMonthlyLimit(dto.getMonthlyLimit());
        entity.setQuarterlyLimit(dto.getQuarterlyLimit());
        entity.setEarnedLeave(dto.getEarnedLeave());
        entity.setCarryForward(dto.getCarryForward());
        entity.setMaxCarryForward(dto.getMaxCarryForward());

        entity = leaveTypeRepository.save(entity);
        return LeaveTypeMapper.toDTO(entity);
    }

    @Override
    public LeaveTypeDTO getById(Long id) {
        return leaveTypeRepository.findById(id)
                .map(LeaveTypeMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<LeaveTypeDTO> getAll(Long organizationId) {
        return leaveTypeRepository.findByOrganizationId(organizationId)
                .stream().map(LeaveTypeMapper::toDTO).toList();
    }

    @Override
    public List<MinimalLeaveTypeDTO> getAllMinimal(Long organizationId) {
        return leaveTypeRepository.findByOrganizationId(organizationId)
                .stream().map(LeaveTypeMapper::toMinimalDTO).toList();
    }

    @Override
    public void delete(Long id) {
        leaveTypeRepository.deleteById(id);
    }
}
