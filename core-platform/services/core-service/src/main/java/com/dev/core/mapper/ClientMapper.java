package com.dev.core.mapper;

import com.dev.core.domain.Client;
import com.dev.core.domain.ClientDocument;
import com.dev.core.domain.ClientRepresentative;
import com.dev.core.model.*;

import java.util.List;
import java.util.stream.Collectors;

public class ClientMapper {

    private ClientMapper() {} // static utility

    public static ClientDTO toDTO(Client entity) {
        if (entity == null) return null;

        ClientDTO dto = ClientDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .name(entity.getName())
                .code(entity.getCode())
                .domain(entity.getDomain())
                .address(entity.getAddress())
                .country(entity.getCountry())
                .industry(entity.getIndustry())
                .status(entity.getStatus())
                .description(entity.getDescription())
                .build();

        // Populate nested collections only when needed (detailed view)
        // We don't load them here by default to avoid N+1 in list views
        return dto;
    }

    public static ClientDTO toDetailedDTO(Client entity) {
        if (entity == null) return null;

        ClientDTO dto = toDTO(entity);

        List<ClientDocumentDTO> documents = entity.getDocuments() != null
                ? entity.getDocuments().stream()
                        .map(ClientDocumentMapper::toDTO)
                        .collect(Collectors.toList())
                : List.of();
        
        

        List<ClientRepresentativeDTO> representatives = entity.getRepresentatives() != null
                ? entity.getRepresentatives().stream()
                        .map(ClientRepresentativeMapper::toDTO)
                        .collect(Collectors.toList())
                : List.of();

        dto.setDocuments(documents);
        dto.setRepresentatives(representatives);

        return dto;
    }

    public static void updateEntityFromDTO(ClientDTO dto, Client entity) {
        if (dto == null || entity == null) return;

        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDomain(dto.getDomain());
        entity.setAddress(dto.getAddress());
        entity.setCountry(dto.getCountry());
        entity.setIndustry(dto.getIndustry());
        entity.setStatus(dto.getStatus());
        entity.setDescription(dto.getDescription());
        // Do NOT touch: id, organizationId, audit fields, active flag (handled separately)
    }
}