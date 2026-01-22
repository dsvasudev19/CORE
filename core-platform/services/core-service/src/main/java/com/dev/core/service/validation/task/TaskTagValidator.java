package com.dev.core.service.validation.task;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.task.TaskTagDTO;
import com.dev.core.repository.task.TaskTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskTagValidator {

    private final TaskTagRepository taskTagRepository;

    public void validateBeforeCreate(TaskTagDTO dto) {
        if (dto == null) throw new ValidationFailedException("Tag details cannot be null");
        if (dto.getName() == null || dto.getName().isBlank())
            throw new ValidationFailedException("Tag name is required");

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException("Organization ID is required for tag creation");

        if (taskTagRepository.existsByOrganizationIdAndNameIgnoreCase(dto.getOrganizationId(), dto.getName()))
            throw new ValidationFailedException("Duplicate tag name: " + dto.getName());
    }

    public void validateBeforeUpdate(Long id, TaskTagDTO dto) {
        if (id == null || !taskTagRepository.existsById(id))
            throw new ValidationFailedException("Invalid tag ID for update");

        if (dto.getName() != null && dto.getName().isBlank())
            throw new ValidationFailedException("Tag name cannot be empty");
    }

    public void validateBeforeDelete(Long id) {
        if (id == null || id <= 0)
            throw new ValidationFailedException("Invalid tag ID for deletion");
    }
}
