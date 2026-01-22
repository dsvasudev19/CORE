package com.dev.core.mapper;

import com.dev.core.domain.Epic;
import com.dev.core.model.EpicDTO;

public final class EpicMapper {

    private EpicMapper() {}

    public static EpicDTO toDTO(Epic entity) {
        if (entity == null) return null;

        return EpicDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .key(entity.getKey())
                .name(entity.getName())
                .description(entity.getDescription())
                .color(entity.getColor())
                .status(entity.getStatus())
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .build();
    }

    public static Epic toEntity(EpicDTO dto) {
        if (dto == null) return null;

        Epic epic = Epic.builder()
                .key(dto.getKey())
                .name(dto.getName())
                .description(dto.getDescription())
                .color(dto.getColor())
                .status(dto.getStatus())
                .build();
        
        // Set BaseEntity fields manually
        epic.setId(dto.getId());
        epic.setOrganizationId(dto.getOrganizationId());
        epic.setActive(dto.getActive());
        epic.setCreatedAt(dto.getCreatedAt());
        epic.setUpdatedAt(dto.getUpdatedAt());
        epic.setCreatedBy(dto.getCreatedBy());
        epic.setUpdatedBy(dto.getUpdatedBy());
        
        return epic;
    }
}
