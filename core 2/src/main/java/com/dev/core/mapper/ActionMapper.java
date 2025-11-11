package com.dev.core.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.dev.core.domain.ActionEntity;
import com.dev.core.model.ActionDTO;

public class ActionMapper {

    public static ActionDTO toDTO(ActionEntity entity) {
        if (entity == null) return null;

        return ActionDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .name(entity.getName())
                .code(entity.getCode())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public static ActionEntity toEntity(ActionDTO dto) {
        if (dto == null) return null;

        ActionEntity entity = new ActionEntity();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setActive(dto.getActive());
        return entity;
    }

    public static List<ActionDTO> toDTOList(List<ActionEntity> entities) {
        return entities == null ? null :
                entities.stream().map(ActionMapper::toDTO).collect(Collectors.toList());
    }
}
