package com.dev.core.service.validation.task;

import com.dev.core.constants.TaskStatus;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.task.TaskDTO;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.task.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TaskValidator {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public void validateBeforeCreate(TaskDTO dto) {
        if (dto == null) {
            throw new ValidationFailedException("Task details cannot be null");
        }
        if (dto.getProjectId() == null) {
            throw new ValidationFailedException("Project ID is required to create a task");
        }

        Optional<Project> projectOpt = projectRepository.findById(dto.getProjectId());
        if (projectOpt.isEmpty()) {
            throw new ValidationFailedException("Invalid Project ID: " + dto.getProjectId());
        }

        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new ValidationFailedException("Task title is required");
        }

        if (dto.getPriority() == null) {
            throw new ValidationFailedException("Task priority cannot be null");
        }

        if (dto.getStatus() == null) {
            dto.setStatus(TaskStatus.BACKLOG);
        }

        if (dto.getParentTaskId() != null &&
                !taskRepository.existsById(dto.getParentTaskId())) {
            throw new ValidationFailedException("Parent task not found: " + dto.getParentTaskId());
        }
    }

    public void validateBeforeUpdate(Long id, TaskDTO dto) {
        if (id == null || !taskRepository.existsById(id)) {
            throw new ValidationFailedException("Invalid task ID: " + id);
        }

        if (dto.getTitle() != null && dto.getTitle().isBlank()) {
            throw new ValidationFailedException("Task title cannot be empty");
        }
    }

    public void validateStatusTransition(Task task, TaskStatus newStatus) {
        TaskStatus oldStatus = task.getStatus();

        if (oldStatus == TaskStatus.DONE && newStatus != TaskStatus.REOPENED) {
            throw new ValidationFailedException("Completed tasks can only be reopened");
        }

        if (oldStatus == TaskStatus.BLOCKED && newStatus == TaskStatus.IN_PROGRESS) {
            // Allowed transition
            return;
        }

        // Prevent invalid jumps (like BACKLOG → DONE)
        if (oldStatus == TaskStatus.BACKLOG && newStatus == TaskStatus.DONE) {
            throw new ValidationFailedException("Cannot move task from BACKLOG directly to DONE");
        }
    }

    public void validateBeforeDelete(Long id, boolean deleteSubtasks) {
        if (id == null || !taskRepository.existsById(id)) {
            throw new ValidationFailedException("Task not found for deletion");
        }

        if (!deleteSubtasks && taskRepository.existsByParentTaskId(id)) {
            throw new ValidationFailedException("Task has subtasks — deleteSubtasks flag required");
        }
    }

    public void validateAssignees(TaskDTO dto) {
        if (dto.getAssigneeIds() == null || dto.getAssigneeIds().isEmpty()) return;
        if (dto.getAssigneeIds().size() > 10) {
            throw new ValidationFailedException("Too many assignees — maximum allowed is 10");
        }
    }

    public void validateDueDate(TaskDTO dto) {
        if (dto.getStartDate() != null && dto.getDueDate() != null &&
                dto.getDueDate().isBefore(dto.getStartDate())) {
            throw new ValidationFailedException("Due date cannot be before start date");
        }
    }
}
