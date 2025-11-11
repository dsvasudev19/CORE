package com.dev.core.service.validation;


import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.RoleDTO;
import com.dev.core.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoleValidator {

    private final RoleRepository roleRepository;

    public void validateBeforeCreate(RoleDTO dto) {
        if (dto.getOrganizationId() == null)
            throw new BaseException("error.role.organization.required");
        if (dto.getName() == null || dto.getName().isBlank())
            throw new BaseException("error.role.name.required");
        if (roleRepository.findByNameAndOrganizationId(dto.getName(), dto.getOrganizationId()).isPresent())
            throw new BaseException("error.role.exists", new Object[]{dto.getName()});
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null)
            throw new BaseException("error.role.id.required");
        if (!roleRepository.existsById(id))
            throw new BaseException("error.role.not.found", new Object[]{id});
    }
}
