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
        if (dto == null) {
            throw new ValidationFailedException("error.bug.payload.null", null);
        }

        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new ValidationFailedException("error.bug.title.required", null);
        }

      

        if (dto.getSeverity() == null) {
            throw new ValidationFailedException("error.bug.severity.required", null);
        }

        log.debug("✅ BugValidator.validateBeforeCreate passed for title={}", dto.getTitle());
    }

    public void validateBeforeUpdate(Long id, BugDTO dto) {
        if (id == null) {
            throw new ValidationFailedException("error.bug.id.required", null);
        }

        if (dto == null) {
            throw new ValidationFailedException("error.bug.update.payload.null", null);
        }

        log.debug("✅ BugValidator.validateBeforeUpdate passed for bugId={}", id);
    }

    public void validateStatusChange(BugStatus oldStatus, BugStatus newStatus) {
        if (oldStatus == null || newStatus == null) {
            throw new ValidationFailedException("error.bug.status.invalid.transition", null);
        }

        if (oldStatus == BugStatus.OPEN && newStatus == BugStatus.CLOSED) {
            throw new ValidationFailedException("error.bug.status.transition.invalid.openToClosed", null);
        }

        log.debug("✅ BugValidator.validateStatusChange passed: {} -> {}", oldStatus, newStatus);
    }

    public void validateSeverityChange(String oldSeverity, String newSeverity) {
        if (newSeverity == null) {
            throw new ValidationFailedException("error.bug.severity.new.required", null);
        }

        if (oldSeverity != null && oldSeverity.equalsIgnoreCase(newSeverity)) {
            throw new ValidationFailedException("error.bug.severity.same.level", null);
        }

        log.debug("✅ BugValidator.validateSeverityChange passed: {} -> {}", oldSeverity, newSeverity);
    }
}
