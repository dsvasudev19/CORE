package com.dev.core.mapper;

import com.dev.core.domain.Client;
import com.dev.core.domain.ClientRepresentative;
import com.dev.core.domain.Contact;
import com.dev.core.model.ClientRepresentativeDTO;

public class ClientRepresentativeMapper {

    public static ClientRepresentativeDTO toDTO(ClientRepresentative entity) {
        if (entity == null) return null;

        return ClientRepresentativeDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
                .contactId(entity.getContact() != null ? entity.getContact().getId() : null)
                .role(entity.getRole())
                .primaryContact(entity.getPrimaryContact())
                .build();
    }

    public static ClientRepresentative toEntity(ClientRepresentativeDTO dto, ClientRepresentative entity, Client client, Contact contact) {
        if (dto == null) return entity;
        if (entity == null) entity = new ClientRepresentative();

        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setClient(client);
        entity.setContact(contact);
        entity.setRole(dto.getRole());
        entity.setPrimaryContact(dto.getPrimaryContact());
        return entity;
    }
}
