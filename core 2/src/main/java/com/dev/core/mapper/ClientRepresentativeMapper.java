package com.dev.core.mapper;

import com.dev.core.domain.Client;
import com.dev.core.domain.ClientRepresentative;
import com.dev.core.domain.Contact;
import com.dev.core.model.ClientRepresentativeDTO;
import com.dev.core.service.ContactService;

public class ClientRepresentativeMapper {

    private ClientRepresentativeMapper() {}
    
    private ContactService contactService;

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
                .contact(entity.getContact() != null ? ContactMapper.toDTO(entity.getContact()) : null)
                .role(entity.getRole())
                .primaryContact(entity.isPrimaryContact())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)

                .build();
    }

    public static ClientRepresentative toEntity(ClientRepresentativeDTO dto, Client client, Contact contact) {
        if (dto == null) return null;

        ClientRepresentative entity = new ClientRepresentative();
        entity.setId(dto.getId());
        entity.setClient(client);
        entity.setContact(contact);
        entity.setRole(dto.getRole());
        entity.setPrimaryContact(dto.isPrimaryContact());
        return entity;
    }

    public static void updateEntityFromDTO(ClientRepresentativeDTO dto, ClientRepresentative entity, Client client, Contact contact) {
        if (dto == null || entity == null) return;

        entity.setClient(client);
        entity.setContact(contact);
        entity.setRole(dto.getRole());
        entity.setPrimaryContact(dto.isPrimaryContact());
    }
}