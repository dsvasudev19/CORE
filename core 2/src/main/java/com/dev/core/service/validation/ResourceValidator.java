package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ResourceDTO;
import com.dev.core.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResourceValidator {

    private final ResourceRepository resourceRepository;

    public void validateBeforeCreate(ResourceDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.resource.null");

        if (dto.getCode() == null || dto.getCode().isBlank())
            throw new ValidationFailedException("error.resource.code.required");

        if (dto.getName() == null || dto.getName().isBlank())
            throw new ValidationFailedException("error.resource.name.required");

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException("error.resource.organization.required");

        if (resourceRepository.findByCode(dto.getCode()).isPresent())
            throw new ValidationFailedException("error.resource.code.exists", new Object[]{dto.getCode()});
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.resource.id.required");

        if (!resourceRepository.existsById(id))
            throw new ValidationFailedException("error.resource.notfound", new Object[]{id});
    }
}
