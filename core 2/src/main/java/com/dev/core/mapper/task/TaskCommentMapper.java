package com.dev.core.mapper.task;

import com.dev.core.domain.TaskComment;
import com.dev.core.model.task.TaskCommentDTO;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TaskCommentMapper {

    public TaskCommentDTO toDTO(TaskComment entity) {
        if (entity == null) return null;
        return TaskCommentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .taskId(entity.getTask() != null ? entity.getTask().getId() : null)
                .commentText(entity.getCommentText())
                .commentedBy(entity.getCommentedBy())
                .commentedAt(entity.getCommentedAt())
                .parentCommentId(entity.getParentCommentId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public TaskComment toEntity(TaskCommentDTO dto) {
        if (dto == null) return null;
        TaskComment entity = new TaskComment();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCommentText(dto.getCommentText());
        entity.setCommentedBy(dto.getCommentedBy());
        entity.setCommentedAt(dto.getCommentedAt());
        entity.setParentCommentId(dto.getParentCommentId());
        entity.setActive(dto.getActive());
        return entity;
    }
}
