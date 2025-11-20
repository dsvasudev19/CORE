package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.DepartmentDTO;
import com.dev.core.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DepartmentValidator {

    private final DepartmentRepository departmentRepository;

    public void validateBeforeCreate(DepartmentDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.department.null",null);

        if (dto.getName() == null || dto.getName().isBlank())
            throw new ValidationFailedException("error.department.name.required",null);

        boolean exists = departmentRepository.existsByNameAndOrganizationId(dto.getName(), dto.getOrganizationId());
        if (exists)
            throw new ValidationFailedException("error.department.name.exists", new Object[]{dto.getName()});
    }

    public void validateBeforeUpdate(Long id, DepartmentDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.department.id.required",null);

        if (!departmentRepository.existsById(id))
            throw new ValidationFailedException("error.department.notfound", new Object[]{id});
    }

    public void validateBeforeDelete(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.department.id.required",null);

        if (!departmentRepository.existsById(id))
            throw new ValidationFailedException("error.department.notfound", new Object[]{id});
    }
}
