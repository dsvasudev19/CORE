package com.dev.core.mapper.bug;

import com.dev.core.domain.BugAttachment;
import com.dev.core.model.bug.BugAttachmentDTO;

public class BugAttachmentMapper {

    private BugAttachmentMapper() {}

    public static BugAttachmentDTO toDTO(BugAttachment entity) {
        if (entity == null) return null;

        return BugAttachmentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .fileName(entity.getFileName())
                .storedPath(entity.getStoredPath())
                .contentType(entity.getContentType())
                .fileSize(entity.getFileSize())
                .visibility(entity.getVisibility())
                .description(entity.getDescription())
                .bugId(entity.getBug() != null ? entity.getBug().getId() : null)
                .build();
    }

    public static BugAttachment toEntity(BugAttachmentDTO dto) {
        if (dto == null) return null;

        BugAttachment entity = new BugAttachment();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setFileName(dto.getFileName());
        entity.setStoredPath(dto.getStoredPath());
        entity.setContentType(dto.getContentType());
        entity.setFileSize(dto.getFileSize());
        entity.setVisibility(dto.getVisibility());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
