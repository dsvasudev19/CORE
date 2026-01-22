package com.dev.core.mapper;

import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectPhase;
import com.dev.core.model.ProjectPhaseDTO;

import java.util.List;
import java.util.stream.Collectors;

public final class ProjectPhaseMapper {

    private ProjectPhaseMapper() {}

    public static ProjectPhaseDTO toDTO(ProjectPhase entity) {
        if (entity == null) return null;

        return ProjectPhaseDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())

                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .name(entity.getName())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .progressPercentage(entity.getProgressPercentage())
                .orderIndex(entity.getOrderIndex())
                .build();
    }

    public static ProjectPhase toEntity(ProjectPhaseDTO dto, Project project) {
        if (dto == null) return null;

        ProjectPhase entity = new ProjectPhase();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        entity.setProject(project);
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setProgressPercentage(dto.getProgressPercentage());
        entity.setOrderIndex(dto.getOrderIndex());

        return entity;
    }

    public static List<ProjectPhaseDTO> toDTOList(List<ProjectPhase> entities) {
        return entities == null ? List.of() : entities.stream()
                .map(ProjectPhaseMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static List<ProjectPhase> toEntityList(List<ProjectPhaseDTO> dtos, Project project) {
        return dtos == null ? List.of() : dtos.stream()
                .map(dto -> toEntity(dto, project))
                .collect(Collectors.toList());
    }
}
