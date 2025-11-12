package com.dev.core.mapper;

import com.dev.core.domain.Project;
import com.dev.core.model.ProjectDTO;

import java.util.List;
import java.util.stream.Collectors;

public final class ProjectMapper {

    private ProjectMapper() {}

    public static ProjectDTO toDTO(Project entity) {
        if (entity == null) return null;

        return ProjectDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())

                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .clientId(entity.getClientId())
                .status(entity.getStatus())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .expectedDeliveryDate(entity.getExpectedDeliveryDate())
                .actualDeliveryDate(entity.getActualDeliveryDate())
                .progressPercentage(entity.getProgressPercentage())
                .build();
    }

    public static Project toEntity(ProjectDTO dto) {
        if (dto == null) return null;

        Project entity = new Project();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setClientId(dto.getClientId());
        entity.setStatus(dto.getStatus());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setExpectedDeliveryDate(dto.getExpectedDeliveryDate());
        entity.setActualDeliveryDate(dto.getActualDeliveryDate());
        entity.setProgressPercentage(dto.getProgressPercentage());

        return entity;
    }

    public static List<ProjectDTO> toDTOList(List<Project> entities) {
        return entities == null ? List.of() : entities.stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static List<Project> toEntityList(List<ProjectDTO> dtos) {
        return dtos == null ? List.of() : dtos.stream()
                .map(ProjectMapper::toEntity)
                .collect(Collectors.toList());
    }
}
