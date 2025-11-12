package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.RoleDTO;
import com.dev.core.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleValidator {

    private final RoleRepository roleRepository;

    public void validateBeforeCreate(RoleDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.role.null");

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException("error.role.organization.required");

        if (dto.getName() == null || dto.getName().isBlank())
            throw new ValidationFailedException("error.role.name.required");

        if (roleRepository.findByNameAndOrganizationId(dto.getName(), dto.getOrganizationId()).isPresent())
            throw new ValidationFailedException("error.role.exists", new Object[]{dto.getName()});
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.role.id.required");

        if (!roleRepository.existsById(id))
            throw new ValidationFailedException("error.role.notfound", new Object[]{id});
    }
}
