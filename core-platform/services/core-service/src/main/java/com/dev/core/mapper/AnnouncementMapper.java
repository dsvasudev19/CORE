package com.dev.core.mapper;

import com.dev.core.domain.Announcement;
import com.dev.core.model.AnnouncementDTO;

public class AnnouncementMapper {

    private AnnouncementMapper() {} // static utility

    public static AnnouncementDTO toDTO(Announcement entity) {
        if (entity == null) return null;

        return AnnouncementDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .title(entity.getTitle())
                .content(entity.getContent())
                .category(entity.getCategory())
                .priority(entity.getPriority())
                .author(entity.getAuthor())
                .publishedDate(entity.getPublishedDate())
                .expiryDate(entity.getExpiryDate())
                .views(entity.getViews())
                .reactions(entity.getReactions())
                .isPinned(entity.getIsPinned())
                .status(entity.getStatus())
                .targetAudience(entity.getTargetAudience())
                .build();
    }

    public static Announcement toEntity(AnnouncementDTO dto) {
        if (dto == null) return null;

        return Announcement.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(dto.getCategory())
                .priority(dto.getPriority())
                .author(dto.getAuthor())
                .publishedDate(dto.getPublishedDate())
                .expiryDate(dto.getExpiryDate())
                .views(dto.getViews() != null ? dto.getViews() : 0)
                .reactions(dto.getReactions() != null ? dto.getReactions() : 0)
                .isPinned(dto.getIsPinned() != null ? dto.getIsPinned() : false)
                .status(dto.getStatus())
                .targetAudience(dto.getTargetAudience())
                .build();
    }

    public static void updateEntityFromDTO(AnnouncementDTO dto, Announcement entity) {
        if (dto == null || entity == null) return;

        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setCategory(dto.getCategory());
        entity.setPriority(dto.getPriority());
        entity.setAuthor(dto.getAuthor());
        entity.setPublishedDate(dto.getPublishedDate());
        entity.setExpiryDate(dto.getExpiryDate());
        entity.setIsPinned(dto.getIsPinned());
        entity.setStatus(dto.getStatus());
        entity.setTargetAudience(dto.getTargetAudience());
    }
}
