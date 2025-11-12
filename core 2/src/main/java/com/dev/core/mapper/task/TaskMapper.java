package com.dev.core.mapper.task;

import com.dev.core.domain.*;
import com.dev.core.mapper.options.TaskMapperOptions;
import com.dev.core.model.task.*;
import lombok.experimental.UtilityClass;

import java.util.Set;
import java.util.stream.Collectors;

@UtilityClass
public class TaskMapper {

    public TaskDTO toDTO(Task entity) {
        return toDTO(entity, TaskMapperOptions.builder()
                .includeAttachments(true)
                .includeComments(true)
                .includeDependencies(true)
                .includeTags(true)
                .includeSubtasks(true)
                .build());
    }

    public TaskDTO toDTO(Task entity, TaskMapperOptions options) {
        if (entity == null) return null;

        TaskDTO.TaskDTOBuilder<?, ?> builder = TaskDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .startDate(entity.getStartDate())
                .dueDate(entity.getDueDate())
                .estimatedHours(entity.getEstimatedHours())
                .actualHours(entity.getActualHours())
                .completedAt(entity.getCompletedAt())
                .phaseId(entity.getPhaseId())
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .parentTaskId(entity.getParentTask() != null ? entity.getParentTask().getId() : null)
                .ownerId(entity.getOwnerId())
                .progressPercentage(entity.getProgressPercentage())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive());

        if (options.isIncludeTags() && entity.getTags() != null) {
            builder.tags(entity.getTags().stream()
                    .map(TaskTagMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        if (options.isIncludeDependencies() && entity.getDependencies() != null) {
            builder.dependencies(entity.getDependencies().stream()
                    .map(TaskDependencyMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        if (options.isIncludeAttachments() && entity.getAttachments() != null) {
            builder.attachments(entity.getAttachments().stream()
                    .map(TaskAttachmentMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        if (options.isIncludeComments() && entity.getComments() != null) {
            builder.comments(entity.getComments().stream()
                    .map(TaskCommentMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        if (options.isIncludeSubtasks() && entity.getSubtasks() != null) {
            // Prevent deep recursion — only include one level of subtasks by default
            builder.subtasks(entity.getSubtasks().stream()
                    .map(sub -> toDTO(sub,
                            TaskMapperOptions.builder()
                                    .includeAttachments(false)
                                    .includeComments(false)
                                    .includeDependencies(false)
                                    .includeTags(false)
                                    .includeSubtasks(false)
                                    .build()))
                    .collect(Collectors.toSet()));
        }

        if (entity.getAssignees() != null) {
            builder.assigneeIds(entity.getAssignees().stream()
                    .map(User::getId)
                    .collect(Collectors.toSet()));
        }

        return builder.build();
    }

    public Task toEntity(TaskDTO dto, Project project) {
        if (dto == null) return null;
        Task entity = new Task();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        entity.setPriority(dto.getPriority());
        entity.setStartDate(dto.getStartDate());
        entity.setDueDate(dto.getDueDate());
        entity.setEstimatedHours(dto.getEstimatedHours());
        entity.setActualHours(dto.getActualHours());
        entity.setCompletedAt(dto.getCompletedAt());
        entity.setPhaseId(dto.getPhaseId());
        entity.setOwnerId(dto.getOwnerId());
        entity.setProject(project);
        entity.setProgressPercentage(dto.getProgressPercentage());
        entity.setActive(dto.getActive());
        return entity;
    }
}
