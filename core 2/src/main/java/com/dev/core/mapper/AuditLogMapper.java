package com.dev.core.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.dev.core.domain.AuditLog;
import com.dev.core.model.AuditLogDTO;

public class AuditLogMapper {

    public static AuditLogDTO toDTO(AuditLog entity) {
        if (entity == null) return null;

        return AuditLogDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .userId(entity.getUserId())
                .action(entity.getAction())
                .entityName(entity.getEntityName())
                .entityId(entity.getEntityId())
                .metadata(entity.getMetadata())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public static AuditLog toEntity(AuditLogDTO dto) {
        if (dto == null) return null;

        AuditLog entity = new AuditLog();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setUserId(dto.getUserId());
        entity.setAction(dto.getAction());
        entity.setEntityName(dto.getEntityName());
        entity.setEntityId(dto.getEntityId());
        entity.setMetadata(dto.getMetadata());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setActive(dto.getActive());
        return entity;
    }

    public static List<AuditLogDTO> toDTOList(List<AuditLog> entities) {
        return entities == null ? null :
                entities.stream().map(AuditLogMapper::toDTO).collect(Collectors.toList());
    }
}
