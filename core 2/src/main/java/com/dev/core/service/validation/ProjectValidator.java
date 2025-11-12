package com.dev.core.service.validation;


import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ProjectDTO;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Objects;

@Component
public class ProjectValidator {

    /**
     * Validation for project creation
     */
    public void validateBeforeCreate(ProjectDTO dto) {
        if (dto == null) {
            throw new ValidationFailedException("Project payload cannot be null");
        }
        if (!StringUtils.hasText(dto.getName())) {
            throw new ValidationFailedException("Project name is required");
        }
        if (dto.getClientId() == null) {
            throw new ValidationFailedException("Client ID is required");
        }
        if (dto.getOrganizationId() == null) {
            throw new ValidationFailedException("Organization ID is required");
        }

        // Date checks
        if (dto.getStartDate() != null && dto.getEndDate() != null &&
                dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new ValidationFailedException("Start date cannot be after end date");
        }

        if (dto.getExpectedDeliveryDate() != null &&
                dto.getStartDate() != null &&
                dto.getExpectedDeliveryDate().isBefore(dto.getStartDate())) {
            throw new ValidationFailedException("Expected delivery date cannot be before start date");
        }

        if (dto.getProgressPercentage() != null &&
                (dto.getProgressPercentage() < 0 || dto.getProgressPercentage() > 100)) {
            throw new ValidationFailedException("Progress percentage must be between 0 and 100");
        }
    }

    /**
     * Validation before project update
     */
    public void validateBeforeUpdate(Long id, ProjectDTO dto) {
        if (id == null) {
            throw new ValidationFailedException("Project ID is required for update");
        }
        if (dto == null) {
            throw new ValidationFailedException("Project payload cannot be null");
        }

        // Reuse common validations
        validateBeforeCreate(dto);
    }

    /**
     * Validation before deleting a project
     */
    public void validateBeforeDelete(Long id) {
        if (id == null || id <= 0) {
            throw new ValidationFailedException("Valid Project ID is required for deletion");
        }
    }

    /**
     * Validation for recalculating progress
     */
    public void validateBeforeProgressRecalculation(Long projectId) {
        if (projectId == null || projectId <= 0) {
            throw new ValidationFailedException("Project ID is required to recalculate progress");
        }
    }

    /**
     * Validation for status update
     */
    public void validateStatusChange(Long projectId, String status) {
        if (projectId == null) {
            throw new ValidationFailedException("Project ID is required to update status");
        }
        if (!StringUtils.hasText(status)) {
            throw new ValidationFailedException("Status cannot be empty");
        }
    }
}
