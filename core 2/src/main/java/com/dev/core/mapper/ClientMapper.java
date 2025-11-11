package com.dev.core.mapper;

import com.dev.core.domain.Client;
import com.dev.core.model.ClientDTO;

public class ClientMapper {

    public static ClientDTO toDTO(Client entity) {
        if (entity == null) return null;

        return ClientDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .name(entity.getName())
                .code(entity.getCode())
                .domain(entity.getDomain())
                .address(entity.getAddress())
                .country(entity.getCountry())
                .industry(entity.getIndustry())
                .status(entity.getStatus())
                .description(entity.getDescription())
                .build();
    }

    public static Client toEntity(ClientDTO dto, Client entity) {
        if (dto == null) return entity;
        if (entity == null) entity = new Client();

        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDomain(dto.getDomain());
        entity.setAddress(dto.getAddress());
        entity.setCountry(dto.getCountry());
        entity.setIndustry(dto.getIndustry());
        entity.setStatus(dto.getStatus());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
