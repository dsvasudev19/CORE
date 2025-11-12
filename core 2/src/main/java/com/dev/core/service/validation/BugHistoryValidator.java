package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.bug.BugHistoryDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BugHistoryValidator {

    public void validateBeforeLog(BugHistoryDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("History entry cannot be null");

        if (dto.getBugId() == null)
            throw new ValidationFailedException("Bug ID is required to log history");

        if (dto.getChangedField() == null || dto.getChangedField().isBlank())
            throw new ValidationFailedException("Changed field is required");

        if (dto.getChangedBy() == null)
            throw new ValidationFailedException("Changed by user ID is required");
    }
}
