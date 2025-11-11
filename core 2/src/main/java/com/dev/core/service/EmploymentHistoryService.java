package com.dev.core.service;

import com.dev.core.model.EmploymentHistoryDTO;

import java.util.List;

public interface EmploymentHistoryService {

    EmploymentHistoryDTO createHistory(EmploymentHistoryDTO dto);

    List<EmploymentHistoryDTO> getHistoryByEmployee(Long employeeId);

    void deleteHistory(Long id);

    // 🔹 Analytics
    long countPromotions(Long organizationId);

    long countResignations(Long organizationId);
}
