package com.dev.core.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.dev.core.domain.Permission;
import com.dev.core.model.PermissionDTO;

public class PermissionMapper {

    public static PermissionDTO toDTO(Permission entity) {
        if (entity == null) return null;

        return PermissionDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .description(entity.getDescription())
                .active(entity.getActive())
                .resource(ResourceMapper.toDTO(entity.getResource()))
                .action(ActionMapper.toDTO(entity.getAction()))
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static Permission toEntity(PermissionDTO dto) {
        if (dto == null) return null;

        Permission entity = new Permission();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setDescription(dto.getDescription());
        entity.setActive(dto.getActive());
        entity.setResource(ResourceMapper.toEntity(dto.getResource()));
        entity.setAction(ActionMapper.toEntity(dto.getAction()));
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }

    public static List<PermissionDTO> toDTOList(List<Permission> entities) {
        return entities == null ? null :
                entities.stream().map(PermissionMapper::toDTO).collect(Collectors.toList());
    }
}
