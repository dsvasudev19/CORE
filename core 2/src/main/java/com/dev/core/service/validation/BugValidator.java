package com.dev.core.service.validation;

import com.dev.core.constants.BugStatus;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.bug.BugDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BugValidator {

    public void validateBeforeCreate(BugDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("Bug payload cannot be null");

        if (dto.getTitle() == null || dto.getTitle().isBlank())
            throw new ValidationFailedException("Bug title is required");

        if (dto.getProject() == null || dto.getProject().getId() == null)
            throw new ValidationFailedException("Project association is required");

        if (dto.getSeverity() == null)
            throw new ValidationFailedException("Bug severity is required");
    }

    public void validateBeforeUpdate(Long id, BugDTO dto) {
        if (id == null)
            throw new ValidationFailedException("Bug ID cannot be null");

        if (dto == null)
            throw new ValidationFailedException("Bug update payload cannot be null");
    }

    public void validateStatusChange(BugStatus oldStatus, BugStatus newStatus) {
        if (oldStatus == null || newStatus == null)
            throw new ValidationFailedException("Invalid bug status transition");

        // Example rule: cannot directly move from OPEN → CLOSED without RESOLVED
        if (oldStatus == BugStatus.OPEN && newStatus == BugStatus.CLOSED)
            throw new ValidationFailedException("Bug must be resolved before closing");
    }

    public void validateSeverityChange(String oldSeverity, String newSeverity) {
        if (newSeverity == null)
            throw new ValidationFailedException("New severity cannot be null");

        if (oldSeverity != null && oldSeverity.equalsIgnoreCase(newSeverity))
            throw new ValidationFailedException("Severity is already set to this level");
    }
}
