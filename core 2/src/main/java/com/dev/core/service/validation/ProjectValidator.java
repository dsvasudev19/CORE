package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ProjectDTO;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class ProjectValidator {

    /**
     * Validation for project creation
     */
    public void validateBeforeCreate(ProjectDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.project.null");

        if (!StringUtils.hasText(dto.getName()))
            throw new ValidationFailedException("error.project.name.required");

        if (dto.getClientId() == null)
            throw new ValidationFailedException("error.project.client.required");

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException("error.project.organization.required");

        if (dto.getStartDate() != null && dto.getEndDate() != null &&
                dto.getStartDate().isAfter(dto.getEndDate()))
            throw new ValidationFailedException("error.project.dates.invalid");

        if (dto.getExpectedDeliveryDate() != null &&
                dto.getStartDate() != null &&
                dto.getExpectedDeliveryDate().isBefore(dto.getStartDate()))
            throw new ValidationFailedException("error.project.deliverydate.invalid");

        if (dto.getProgressPercentage() != null &&
                (dto.getProgressPercentage() < 0 || dto.getProgressPercentage() > 100))
            throw new ValidationFailedException("error.project.progress.invalid");
    }

    /**
     * Validation before project update
     */
    public void validateBeforeUpdate(Long id, ProjectDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.project.id.required");

        if (dto == null)
            throw new ValidationFailedException("error.project.null");

        validateBeforeCreate(dto);
    }

    /**
     * Validation before deleting a project
     */
    public void validateBeforeDelete(Long id) {
        if (id == null || id <= 0)
            throw new ValidationFailedException("error.project.id.required");
    }

    /**
     * Validation for recalculating progress
     */
    public void validateBeforeProgressRecalculation(Long projectId) {
        if (projectId == null || projectId <= 0)
            throw new ValidationFailedException("error.project.id.required");
    }

    /**
     * Validation for status update
     */
    public void validateStatusChange(Long projectId, String status) {
        if (projectId == null)
            throw new ValidationFailedException("error.project.id.required");

        if (!StringUtils.hasText(status))
            throw new ValidationFailedException("error.project.status.required");
    }
}
