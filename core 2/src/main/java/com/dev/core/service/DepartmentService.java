package com.dev.core.service;

import java.util.List;
import java.util.Optional;

import com.dev.core.domain.Department;
import com.dev.core.model.DepartmentDTO;

public interface DepartmentService {

    DepartmentDTO createDepartment(DepartmentDTO dto);

    DepartmentDTO updateDepartment(Long id, DepartmentDTO dto);

    void deleteDepartment(Long id);

    DepartmentDTO getDepartmentById(Long id);

    List<DepartmentDTO> getAllDepartments(Long organizationId);

    // 🔹 Analytics
    long getEmployeeCount(Long departmentId);

    long getTeamCount(Long departmentId);
    
    Optional<DepartmentDTO> findByCode(String code);
}
