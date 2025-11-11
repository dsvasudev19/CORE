package com.dev.core.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.dev.core.domain.ResourceEntity;
import com.dev.core.model.ResourceDTO;

public class ResourceMapper {

    public static ResourceDTO toDTO(ResourceEntity entity) {
        if (entity == null) return null;

        return ResourceDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public static ResourceEntity toEntity(ResourceDTO dto) {
        if (dto == null) return null;

        ResourceEntity entity = new ResourceEntity();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setActive(dto.getActive());
        return entity;
    }

    public static List<ResourceDTO> toDTOList(List<ResourceEntity> entities) {
        return entities == null ? null :
                entities.stream().map(ResourceMapper::toDTO).collect(Collectors.toList());
    }
}
