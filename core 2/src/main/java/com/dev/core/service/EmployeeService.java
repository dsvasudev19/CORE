package com.dev.core.service;

import com.dev.core.model.EmployeeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeService {

    EmployeeDTO createEmployee(EmployeeDTO dto);

    EmployeeDTO updateEmployee(Long id, EmployeeDTO dto);

    void deleteEmployee(Long id);

    EmployeeDTO getEmployeeById(Long id);

    List<EmployeeDTO> getAllEmployees(Long organizationId);

    Page<EmployeeDTO> searchEmployees(Long organizationId, String keyword, Pageable pageable);

    // 🔹 Assign & Manage Teams
    void assignToTeam(Long employeeId, Long teamId, boolean isLead);

    void removeFromTeam(Long employeeId, Long teamId);

    // 🔹 Manage Employee Lifecycle
    void markAsResigned(Long employeeId, String remarks);

    void promoteEmployee(Long employeeId, String newDesignation, String newDepartment);

    // 🔹 Document Management
    void uploadDocument(Long employeeId, String documentName, String documentType, String filePath);

    void verifyDocument(Long documentId, boolean verified);

    // 🔹 History & Reporting
    List<EmployeeDTO> getEmployeesByDepartment(Long organizationId, Long departmentId);

    List<EmployeeDTO> getEmployeesByStatus(Long organizationId, String status);
}
