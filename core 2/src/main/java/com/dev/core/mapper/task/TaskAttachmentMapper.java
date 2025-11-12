package com.dev.core.mapper.task;

import com.dev.core.domain.TaskAttachment;
import com.dev.core.model.task.TaskAttachmentDTO;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TaskAttachmentMapper {

    public TaskAttachmentDTO toDTO(TaskAttachment entity) {
        if (entity == null) return null;
        return TaskAttachmentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .taskId(entity.getTask() != null ? entity.getTask().getId() : null)
                .fileName(entity.getFileName())
                .storedPath(entity.getStoredPath())
                .contentType(entity.getContentType())
                .fileSize(entity.getFileSize())
                .visibility(entity.getVisibility())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public TaskAttachment toEntity(TaskAttachmentDTO dto) {
        if (dto == null) return null;
        TaskAttachment entity = new TaskAttachment();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setFileName(dto.getFileName());
        entity.setStoredPath(dto.getStoredPath());
        entity.setContentType(dto.getContentType());
        entity.setFileSize(dto.getFileSize());
        entity.setVisibility(dto.getVisibility());
        entity.setDescription(dto.getDescription());
        entity.setActive(dto.getActive());
        return entity;
    }
}
