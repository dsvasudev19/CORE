package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ProjectPhaseDTO;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class ProjectPhaseValidator {

    public void validateBeforeCreate(ProjectPhaseDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.phase.null");

        if (dto.getProjectId() == null)
            throw new ValidationFailedException("error.phase.projectid.required");

        if (!StringUtils.hasText(dto.getName()))
            throw new ValidationFailedException("error.phase.name.required");

        if (dto.getProgressPercentage() != null &&
                (dto.getProgressPercentage() < 0 || dto.getProgressPercentage() > 100))
            throw new ValidationFailedException("error.phase.progress.invalid");

        if (dto.getStartDate() != null && dto.getEndDate() != null &&
                dto.getStartDate().isAfter(dto.getEndDate()))
            throw new ValidationFailedException("error.phase.dates.invalid");
    }

    public void validateBeforeUpdate(Long id, ProjectPhaseDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.phase.id.required");

        validateBeforeCreate(dto);
    }

    public void validateBeforeDelete(Long id) {
        if (id == null || id <= 0)
            throw new ValidationFailedException("error.phase.id.required");
    }

    public void validateBeforeReorder(Long projectId, List<Long> orderedPhaseIds) {
        if (projectId == null)
            throw new ValidationFailedException("error.phase.projectid.required");

        if (orderedPhaseIds == null || orderedPhaseIds.isEmpty())
            throw new ValidationFailedException("error.phase.reorder.list.empty");
    }
}
