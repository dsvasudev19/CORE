package com.dev.core.service.validation;

import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.PermissionDTO;
import com.dev.core.repository.PermissionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PermissionValidator {

    private final PermissionRepository permissionRepository;

    public void validateBeforeCreate(PermissionDTO dto) {
        if (dto.getOrganizationId() == null)
            throw new BaseException("error.permission.organization.required");
        if (dto.getResource() == null || dto.getAction() == null)
            throw new BaseException("error.permission.resource.action.required");

        var exists = permissionRepository.findByResource_IdAndAction_IdAndOrganizationId(
                dto.getResource().getId(), dto.getAction().getId(), dto.getOrganizationId());
        if (exists.isPresent())
            throw new BaseException("error.permission.duplicate");
    }

    public void validateBeforeDelete(Long id) {
        if (id == null)
            throw new BaseException("error.permission.id.required");
        if (!permissionRepository.existsById(id))
            throw new BaseException("error.permission.not.found", new Object[]{id});
    }
}
