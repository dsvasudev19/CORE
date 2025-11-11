package com.dev.core.service.validation;

import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.OrganizationDTO;
import com.dev.core.repository.OrganizationRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrganizationValidator {

    private final OrganizationRepository organizationRepository;

    public void validateBeforeCreate(OrganizationDTO dto) {
        if (dto.getName() == null || dto.getName().isBlank())
            throw new BaseException("error.organization.name.required");
        if (dto.getCode() == null || dto.getCode().isBlank())
            throw new BaseException("error.organization.code.required");
        if (organizationRepository.existsByCode(dto.getCode()))
            throw new BaseException("error.organization.code.exists", new Object[]{dto.getCode()});
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null)
            throw new BaseException("error.organization.id.required");
        if (!organizationRepository.existsById(id))
            throw new BaseException("error.organization.not.found", new Object[]{id});
    }
}
