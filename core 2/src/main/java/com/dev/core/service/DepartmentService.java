package com.dev.core.service;

import com.dev.core.model.DepartmentDTO;

import java.util.List;

public interface DepartmentService {

    DepartmentDTO createDepartment(DepartmentDTO dto);

    DepartmentDTO updateDepartment(Long id, DepartmentDTO dto);

    void deleteDepartment(Long id);

    DepartmentDTO getDepartmentById(Long id);

    List<DepartmentDTO> getAllDepartments(Long organizationId);

    // 🔹 Analytics
    long getEmployeeCount(Long departmentId);

    long getTeamCount(Long departmentId);
}
