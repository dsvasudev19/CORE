package com.dev.core.service.impl;

import com.dev.core.domain.EmploymentHistory;
import com.dev.core.domain.Employee;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.EmploymentHistoryMapper;
import com.dev.core.model.EmploymentHistoryDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.EmploymentHistoryRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.EmploymentHistoryService;
import com.dev.core.service.validation.EmploymentHistoryValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EmploymentHistoryServiceImpl implements EmploymentHistoryService {

    private final EmploymentHistoryRepository historyRepository;
    private final EmployeeRepository employeeRepository;
    private final EmploymentHistoryValidator historyValidator;
    private final AuthorizationService authorizationService;

    /**
     * RBAC helper
     */
    private void authorize(String action) {
        authorizationService.authorize("EMPLOYMENT_HISTORY", action);
    }

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    @Override
    public EmploymentHistoryDTO createHistory(EmploymentHistoryDTO dto) {
        authorize("CREATE");
        historyValidator.validateBeforeCreate(dto);

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{dto.getEmployeeId()}));

        EmploymentHistory entity = EmploymentHistoryMapper.toEntity(dto);
        entity.setEmployee(employee);
        entity.setOrganizationId(employee.getOrganizationId());

        EmploymentHistory saved = historyRepository.save(entity);
        log.info("📜 Employment history created for employee {} ({} → {})",
                employee.getId(), entity.getPreviousDesignation(), entity.getNewDesignation());

        return EmploymentHistoryMapper.toDTO(saved);
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<EmploymentHistoryDTO> getHistoryByEmployee(Long employeeId) {
        authorize("READ");

        if (employeeId == null)
            throw new ValidationFailedException("error.employee.id.required", "Employee ID is required");

        List<EmploymentHistory> historyList = historyRepository.findByEmployee_Id(employeeId);
        if (historyList.isEmpty())
            log.debug("⚠️ No employment history found for employee {}", employeeId);

        return historyList.stream().map(EmploymentHistoryMapper::toDTO).collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    @Override
    public void deleteHistory(Long id) {
        authorize("DELETE");
        historyValidator.validateBeforeDelete(id);

        historyRepository.deleteById(id);
        log.info("🗑️ Deleted employment history record with ID {}", id);
    }

    // ---------------------------------------------------------------------
    // ANALYTICS
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public long countPromotions(Long organizationId) {
        authorize("READ");

        // Counts all records where newDesignation differs from previousDesignation
        long count = historyRepository.findAll().stream()
                .filter(h -> organizationId.equals(h.getOrganizationId()))
                .filter(h -> h.getNewDesignation() != null && h.getPreviousDesignation() != null)
                .filter(h -> !h.getNewDesignation().equalsIgnoreCase(h.getPreviousDesignation()))
                .count();

        log.debug("🎖️ Promotions count for org {}: {}", organizationId, count);
        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public long countResignations(Long organizationId) {
        authorize("READ");

        // Counts all records where newDesignation is 'Resigned' (case-insensitive)
        long count = historyRepository.findAll().stream()
                .filter(h -> organizationId.equals(h.getOrganizationId()))
                .filter(h -> "RESIGNED".equalsIgnoreCase(h.getNewDesignation()))
                .count();

        log.debug("🚪 Resignations count for org {}: {}", organizationId, count);
        return count;
    }
}
