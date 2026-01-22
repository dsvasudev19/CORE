package com.dev.core.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.dev.core.domain.Policy;
import com.dev.core.model.PolicyDTO;

public class PolicyMapper {

    public static PolicyDTO toDTO(Policy entity) {
        if (entity == null) return null;

        return PolicyDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .role(RoleMapper.toDTO(entity.getRole()))
                .resource(ResourceMapper.toDTO(entity.getResource()))
                .action(ActionMapper.toDTO(entity.getAction()))
                .condition(entity.getCondition())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public static Policy toEntity(PolicyDTO dto) {
        if (dto == null) return null;

        Policy entity = new Policy();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setRole(RoleMapper.toEntity(dto.getRole()));
        entity.setResource(ResourceMapper.toEntity(dto.getResource()));
        entity.setAction(ActionMapper.toEntity(dto.getAction()));
        entity.setCondition(dto.getCondition());
        entity.setDescription(dto.getDescription());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setActive(dto.getActive());
        return entity;
    }

    public static List<PolicyDTO> toDTOList(List<Policy> entities) {
        return entities == null ? null :
                entities.stream().map(PolicyMapper::toDTO).collect(Collectors.toList());
    }
}
