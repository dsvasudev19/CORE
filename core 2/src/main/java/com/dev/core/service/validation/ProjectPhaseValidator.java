package com.dev.core.service.validation;


import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ProjectPhaseDTO;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Component
public class ProjectPhaseValidator {

    public void validateBeforeCreate(ProjectPhaseDTO dto) {
        if (dto == null) {
            throw new ValidationFailedException("Phase payload cannot be null");
        }
        if (dto.getProjectId() == null) {
            throw new ValidationFailedException("Project ID is required for phase creation");
        }
        if (!StringUtils.hasText(dto.getName())) {
            throw new ValidationFailedException("Phase name is required");
        }

        if (dto.getProgressPercentage() != null &&
                (dto.getProgressPercentage() < 0 || dto.getProgressPercentage() > 100)) {
            throw new ValidationFailedException("Phase progress must be between 0 and 100");
        }

        // Date validation
        if (dto.getStartDate() != null && dto.getEndDate() != null &&
                dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new ValidationFailedException("Phase start date cannot be after end date");
        }
    }

    public void validateBeforeUpdate(Long id, ProjectPhaseDTO dto) {
        if (id == null) {
            throw new ValidationFailedException("Phase ID is required for update");
        }
        validateBeforeCreate(dto);
    }

    public void validateBeforeDelete(Long id) {
        if (id == null || id <= 0) {
            throw new ValidationFailedException("Valid Phase ID is required for deletion");
        }
    }

    public void validateBeforeReorder(Long projectId, List<Long> orderedPhaseIds) {
        if (projectId == null) {
            throw new ValidationFailedException("Project ID is required to reorder phases");
        }
        if (orderedPhaseIds == null || orderedPhaseIds.isEmpty()) {
            throw new ValidationFailedException("Ordered phase list cannot be empty");
        }
    }
}
