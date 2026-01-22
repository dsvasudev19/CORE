package com.dev.core.mapper;

import com.dev.core.domain.Sprint;
import com.dev.core.model.SprintDTO;

public final class SprintMapper {

    private SprintMapper() {}

    public static SprintDTO toDTO(Sprint entity) {
        if (entity == null) return null;

        return SprintDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .name(entity.getName())
                .goal(entity.getGoal())
                .status(entity.getStatus())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .build();
    }

    public static Sprint toEntity(SprintDTO dto) {
        if (dto == null) return null;

        Sprint sprint = Sprint.builder()
                .name(dto.getName())
                .goal(dto.getGoal())
                .status(dto.getStatus())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();
        
        // Set BaseEntity fields manually
        sprint.setId(dto.getId());
        sprint.setOrganizationId(dto.getOrganizationId());
        sprint.setActive(dto.getActive());
        sprint.setCreatedAt(dto.getCreatedAt());
        sprint.setUpdatedAt(dto.getUpdatedAt());
        sprint.setCreatedBy(dto.getCreatedBy());
        sprint.setUpdatedBy(dto.getUpdatedBy());
        
        return sprint;
    }
}
