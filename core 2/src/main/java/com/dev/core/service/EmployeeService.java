package com.dev.core.service;

import com.dev.core.constants.ProfileStatus;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.EmployeeAssetDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeService {

    // ---------------------------
    // 🔹 CRUD
    // ---------------------------
    EmployeeDTO createEmployee(EmployeeDTO dto);
    EmployeeDTO updateEmployee(Long id, EmployeeDTO dto);
    void deleteEmployee(Long id);
    EmployeeDTO getEmployeeById(Long id);

    List<EmployeeDTO> getAllEmployees(Long organizationId);
    Page<EmployeeDTO> searchEmployees(Long organizationId, String keyword, Pageable pageable);

    // ---------------------------
    // 🔹 Profile Status
    // ---------------------------
    void updateProfileStatus(Long employeeId, ProfileStatus status);
    void markProfileAsCompleted(Long employeeId);

    // ---------------------------
    // 🔹 Manager Assignment
    // ---------------------------
    void assignManager(Long employeeId, Long managerId);
    void removeManager(Long employeeId);

    // ---------------------------
    // 🔹 Team Assignment
    // ---------------------------
    void assignToTeam(Long employeeId, Long teamId, boolean isLead);
    void removeFromTeam(Long employeeId, Long teamId);

    // ---------------------------
    // 🔹 Document Management
    // ---------------------------
    void uploadDocument(Long employeeId, String documentName, String documentType, String filePath);
    void verifyDocument(Long documentId, boolean verified);

    // ---------------------------
    // 🔹 Assets Management
    // ---------------------------
    EmployeeAssetDTO addAsset(Long employeeId, EmployeeAssetDTO assetDTO);
    void removeAsset(Long assetId);
    List<EmployeeAssetDTO> getEmployeeAssets(Long employeeId);

    // ---------------------------
    // 🔹 Employee Lifecycle
    // ---------------------------
    void markAsResigned(Long employeeId, String remarks);
    void promoteEmployee(Long employeeId, String newDesignation, String newDepartment);

    // ---------------------------
    // 🔹 Reports / Filters
    // ---------------------------
    List<EmployeeDTO> getEmployeesByDepartment(Long organizationId, Long departmentId);
    List<EmployeeDTO> getEmployeesByStatus(Long organizationId, String status);
	Page<EmployeeDTO> getAllEmployees(Long organizationId, Pageable pageable);
}
