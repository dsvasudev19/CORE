package com.dev.core.mapper;

import com.dev.core.domain.Bug;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.domain.TimeLog;
import com.dev.core.model.TimeLogDTO;

public class TimeLogMapper {

    // ------------------------------------------------------
    // toDTO : MUST USE builder()
    // ------------------------------------------------------
    public static TimeLogDTO toDTO(TimeLog entity) {
        if (entity == null) return null;

        return TimeLogDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.isActive())

                .userId(entity.getUserId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .durationMinutes(entity.getDurationMinutes())

                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .taskId(entity.getTask() != null ? entity.getTask().getId() : null)
                .bugId(entity.getBug() != null ? entity.getBug().getId() : null)
                .workDate(entity.getWorkDate())
                .note(entity.getNote())

                .build();
    }

    // ------------------------------------------------------
    // toEntity : DO NOT use builder (your rule)
    // ------------------------------------------------------
    public static TimeLog toEntity(TimeLogDTO dto, Project project, Task task, Bug bug) {
        if (dto == null) return null;

        TimeLog entity = new TimeLog();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());

        entity.setUserId(dto.getUserId());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setDurationMinutes(dto.getDurationMinutes());
        entity.setNote(dto.getNote());
        entity.setActive(dto.isActive());
        entity.setWorkDate(dto.getWorkDate());

        entity.setProject(project);
        entity.setTask(task);
        entity.setBug(bug);

        return entity;
    }
}
