package com.dev.core.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.dev.core.domain.Organization;
import com.dev.core.model.OrganizationDTO;

public class OrganizationMapper {

    public static OrganizationDTO toDTO(Organization entity) {
        if (entity == null) return null;

        return OrganizationDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .name(entity.getName())
                .code(entity.getCode())
                .domain(entity.getDomain())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())
                .build();
    }

    public static Organization toEntity(OrganizationDTO dto) {
        if (dto == null) return null;

        Organization entity = new Organization();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDomain(dto.getDomain());
        entity.setStatus(dto.getStatus());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());
        return entity;
    }

    public static List<OrganizationDTO> toDTOList(List<Organization> entities) {
        return entities == null ? null :
                entities.stream().map(OrganizationMapper::toDTO).collect(Collectors.toList());
    }
}
