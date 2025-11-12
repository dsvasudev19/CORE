package com.dev.core.mapper.task;

import com.dev.core.domain.TaskDependency;
import com.dev.core.model.task.TaskDependencyDTO;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TaskDependencyMapper {

    public TaskDependencyDTO toDTO(TaskDependency entity) {
        if (entity == null) return null;
        return TaskDependencyDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .taskId(entity.getTask() != null ? entity.getTask().getId() : null)
                .dependsOnTaskId(entity.getDependsOn() != null ? entity.getDependsOn().getId() : null)
                .dependencyType(entity.getDependencyType())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public TaskDependency toEntity(TaskDependencyDTO dto) {
        if (dto == null) return null;
        TaskDependency entity = new TaskDependency();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setDependencyType(dto.getDependencyType());
        entity.setActive(dto.getActive());
        return entity;
    }
}
