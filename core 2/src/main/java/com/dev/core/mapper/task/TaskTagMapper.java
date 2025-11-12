package com.dev.core.mapper.task;

import com.dev.core.domain.TaskTag;
import com.dev.core.model.task.TaskTagDTO;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TaskTagMapper {

    public TaskTagDTO toDTO(TaskTag entity) {
        if (entity == null) return null;
        return TaskTagDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .name(entity.getName())
                .color(entity.getColor())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public TaskTag toEntity(TaskTagDTO dto) {
        if (dto == null) return null;
        TaskTag entity = new TaskTag();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setColor(dto.getColor());
        entity.setActive(dto.getActive());
        return entity;
    }
}
