package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmployeeValidator {

    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final EmployeeRepository employeeRepository;

    public void validateBeforeCreate(EmployeeDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.employee.null", "Employee data cannot be null");

        if (dto.getEmail() == null || dto.getEmail().isBlank())
            throw new ValidationFailedException("error.employee.email.required", "Email is required");

        if (dto.getFirstName() == null || dto.getFirstName().isBlank())
            throw new ValidationFailedException("error.employee.firstname.required", "First name is required");

        boolean exists = employeeRepository.existsByEmailAndOrganizationId(dto.getEmail(), dto.getOrganizationId());
        if (exists)
            throw new ValidationFailedException("error.employee.email.exists",
                    new Object[]{dto.getEmail()});

        if (dto.getDepartmentId() != null && !departmentRepository.existsById(dto.getDepartmentId()))
            throw new ValidationFailedException("error.department.notfound",
                    new Object[]{dto.getDepartmentId()});

        if (dto.getDesignationId() != null && !designationRepository.existsById(dto.getDesignationId()))
            throw new ValidationFailedException("error.designation.notfound",
                    new Object[]{dto.getDesignationId()});
    }

    public void validateBeforeUpdate(Long id, EmployeeDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.employee.id.required", "Employee ID is required");

        if (!employeeRepository.existsById(id))
            throw new ValidationFailedException("error.employee.notfound", new Object[]{id});

        if (dto.getEmail() != null) {
            boolean emailTaken = employeeRepository.existsByEmailAndIdNot(dto.getEmail(), id);
            if (emailTaken)
                throw new ValidationFailedException("error.employee.email.exists", new Object[]{dto.getEmail()});
        }
    }

    public void validateForPromotion(Long employeeId, String newDesignation, String newDepartment) {
        if (employeeId == null)
            throw new ValidationFailedException("error.employee.id.required", "Employee ID required");

        if (!employeeRepository.existsById(employeeId))
            throw new ValidationFailedException("error.employee.notfound", new Object[]{employeeId});

        if (newDesignation == null && newDepartment == null)
            throw new ValidationFailedException("error.promotion.invalid.details", "Promotion details missing");
    }
}
