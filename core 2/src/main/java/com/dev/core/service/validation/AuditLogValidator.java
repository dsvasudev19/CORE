package com.dev.core.service.validation;


import com.dev.core.exception.BaseException;
import com.dev.core.model.AuditLogDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditLogValidator {

    public void validateBeforeCreate(AuditLogDTO dto) {
        if (dto.getOrganizationId() == null)
            throw new BaseException("error.audit.organization.required");
        if (dto.getAction() == null || dto.getAction().isBlank())
            throw new BaseException("error.audit.action.required");
    }
}
