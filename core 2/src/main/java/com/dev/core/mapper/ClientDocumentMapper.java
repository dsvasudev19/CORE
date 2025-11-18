package com.dev.core.mapper;

import com.dev.core.domain.Client;
import com.dev.core.domain.ClientDocument;
import com.dev.core.model.ClientDocumentDTO;

public class ClientDocumentMapper {

    private ClientDocumentMapper() {}

    public static ClientDocumentDTO toDTO(ClientDocument entity) {
        if (entity == null) return null;

        return ClientDocumentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
                .fileId(entity.getFileId())
                .title(entity.getTitle())
                .category(entity.getCategory())
                .uploadedBy(entity.getUploadedBy())
                .description(entity.getDescription())
                .build();
    }

    public static ClientDocument toEntity(ClientDocumentDTO dto, Client client) {
        if (dto == null) return null;

        ClientDocument entity = new ClientDocument();
        entity.setId(dto.getId()); // null on create
        entity.setClient(client);
        entity.setFileId(dto.getFileId());
        entity.setTitle(dto.getTitle());
        entity.setCategory(dto.getCategory());
        entity.setUploadedBy(dto.getUploadedBy());
        entity.setDescription(dto.getDescription());
        return entity;
    }

    public static void updateEntityFromDTO(ClientDocumentDTO dto, ClientDocument entity, Client client) {
        if (dto == null || entity == null) return;

        entity.setClient(client);
        entity.setFileId(dto.getFileId());
        entity.setTitle(dto.getTitle());
        entity.setCategory(dto.getCategory());
        entity.setUploadedBy(dto.getUploadedBy());
        entity.setDescription(dto.getDescription());
    }
}