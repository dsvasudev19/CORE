package com.dev.core.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.dev.core.constants.OperationType;
import com.dev.core.domain.BaseEntity;
import com.dev.core.security.SecurityContextUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BaseEntityAuditService {

    private final SecurityContextUtil securityContextUtil;

    public <T extends BaseEntity> T applyAudit(T entity, OperationType operation) {

        Long currentUserId = securityContextUtil.getCurrentUserId();
        Long currentOrgId = securityContextUtil.getCurrentOrganizationId();

        if (operation == OperationType.CREATE) {
            entity.setCreatedAt(LocalDateTime.now());
            entity.setCreatedBy(currentUserId);
            entity.setOrganizationId(currentOrgId);
            entity.setActive(true); // default
        }

        if (operation == OperationType.UPDATE) {
            entity.setUpdatedAt(LocalDateTime.now());
            entity.setUpdatedBy(currentUserId);
            // Organization ID not changed on update
        }

        if (operation == OperationType.DELETE) {
            entity.setUpdatedAt(LocalDateTime.now());
            entity.setUpdatedBy(currentUserId);
            entity.setActive(false); // soft delete
        }

        if (operation == OperationType.STATUS_CHANGE) {
            entity.setUpdatedAt(LocalDateTime.now());
            entity.setUpdatedBy(currentUserId);
            // active status will already be set externally
        }

        return entity;
    }
}
