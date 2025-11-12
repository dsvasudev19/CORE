package com.dev.core.service.validation.task;

import com.dev.core.domain.Task;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.task.TaskDependencyDTO;
import com.dev.core.repository.task.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskDependencyValidator {

    private final TaskRepository taskRepository;

    public void validateBeforeCreate(TaskDependencyDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("Dependency details cannot be null");

        if (dto.getTaskId() == null || dto.getDependsOnTaskId() == null)
            throw new ValidationFailedException("Both taskId and dependsOnTaskId are required");

        if (dto.getTaskId().equals(dto.getDependsOnTaskId()))
            throw new ValidationFailedException("Task cannot depend on itself");

        Task task = taskRepository.findById(dto.getTaskId()).orElse(null);
        Task dependsOn = taskRepository.findById(dto.getDependsOnTaskId()).orElse(null);

        if (task == null || dependsOn == null)
            throw new ValidationFailedException("Invalid task IDs for dependency");

        // Prevent circular dependency
        if (taskRepository.existsDependencyCycle(dto.getTaskId(), dto.getDependsOnTaskId())) {
            throw new ValidationFailedException("Circular dependency detected");
        }
    }

    public void validateBeforeDelete(Long dependencyId) {
        if (dependencyId == null || dependencyId <= 0)
            throw new ValidationFailedException("Invalid dependency ID");
    }
}
