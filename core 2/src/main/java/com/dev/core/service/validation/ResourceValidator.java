package com.dev.core.service.validation;

import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.ResourceDTO;
import com.dev.core.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ResourceValidator {

    private final ResourceRepository resourceRepository;

    public void validateBeforeCreate(ResourceDTO dto) {
        if (dto.getCode() == null || dto.getCode().isBlank())
            throw new BaseException("error.resource.code.required");
        if (dto.getName() == null || dto.getName().isBlank())
            throw new BaseException("error.resource.name.required");
        if (dto.getOrganizationId() == null)
            throw new BaseException("error.resource.organization.required");
        if (resourceRepository.findByCode(dto.getCode()).isPresent())
            throw new BaseException("error.resource.code.exists", new Object[]{dto.getCode()});
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null || !resourceRepository.existsById(id))
            throw new BaseException("error.resource.not.found", new Object[]{id});
    }
}

