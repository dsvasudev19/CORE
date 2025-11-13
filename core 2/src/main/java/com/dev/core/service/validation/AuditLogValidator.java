package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.AuditLogDTO;
import org.springframework.stereotype.Component;

@Component
public class AuditLogValidator {

    public void validateBeforeCreate(AuditLogDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.audit.null",null);

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException("error.audit.organization.required",null);

        if (dto.getAction() == null || dto.getAction().isBlank())
            throw new ValidationFailedException("error.audit.action.required",null);

        if (dto.getUserId() == null)
            throw new ValidationFailedException("error.audit.user.required",null);
    }
}
