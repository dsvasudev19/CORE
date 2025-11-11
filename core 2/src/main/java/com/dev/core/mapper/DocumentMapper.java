package com.dev.core.mapper;

import com.dev.core.domain.Document;
import com.dev.core.model.DocumentDTO;

public class DocumentMapper {

    public static DocumentDTO toDTO(Document entity) {
        if (entity == null) return null;

        return DocumentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .entityType(entity.getEntityType())
                .entityId(entity.getEntityId())
                .fileId(entity.getFileId())
                .title(entity.getTitle())
                .category(entity.getCategory())
                .uploadedBy(entity.getUploadedBy())
                .description(entity.getDescription())
                .visibility(entity.getVisibility())
                .build();
    }

    public static Document toEntity(DocumentDTO dto, Document entity) {
        if (dto == null) return entity;
        if (entity == null) entity = new Document();

        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setEntityType(dto.getEntityType());
        entity.setEntityId(dto.getEntityId());
        entity.setFileId(dto.getFileId());
        entity.setTitle(dto.getTitle());
        entity.setCategory(dto.getCategory());
        entity.setUploadedBy(dto.getUploadedBy());
        entity.setDescription(dto.getDescription());
        entity.setVisibility(dto.getVisibility());
        return entity;
    }
}
