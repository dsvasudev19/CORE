package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.bug.BugHistoryDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BugHistoryValidator {

    public void validateBeforeLog(BugHistoryDTO dto) {
        if (dto == null) {
            throw new ValidationFailedException("error.bug.history.null");
        }

        if (dto.getBugId() == null) {
            throw new ValidationFailedException("error.bug.history.bugId.required");
        }

        if (dto.getChangedField() == null || dto.getChangedField().isBlank()) {
            throw new ValidationFailedException("error.bug.history.changedField.required");
        }

        if (dto.getChangedBy() == null) {
            throw new ValidationFailedException("error.bug.history.changedBy.required");
        }

        log.debug("✅ BugHistoryValidator.validateBeforeLog passed for bugId={}", dto.getBugId());
    }
}
