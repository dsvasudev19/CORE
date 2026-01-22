package com.dev.core.mapper.performance;

import com.dev.core.domain.performance.PerformanceReview;
import com.dev.core.model.performance.PerformanceReviewDTO;
import com.dev.core.domain.performance.PerformanceReviewRequest;

public final class PerformanceReviewMapper {

    private PerformanceReviewMapper() {}

    public static PerformanceReviewDTO toDTO(PerformanceReview entity) {
        if (entity == null) return null;

        PerformanceReviewDTO dto = PerformanceReviewDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .requestId(entity.getRequest() != null ? entity.getRequest().getId() : null)
                .request(PerformanceReviewRequestMapper.toDTO(entity.getRequest()))
                .rating(entity.getRating())
                .strengths(entity.getStrengths())
                .improvements(entity.getImprovements())
                .comments(entity.getComments())
                .nextQuarterGoals(entity.getNextQuarterGoals())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();

        return dto;
    }

    /**
     * Convert DTO to entity. Caller should set the request association (fetch PerformanceReviewRequest and set it).
     */
    public static PerformanceReview toEntity(PerformanceReviewDTO dto) {
        if (dto == null) return null;
        PerformanceReview e = new PerformanceReview();
        if (dto.getId() != null) e.setId(dto.getId());
        e.setOrganizationId(dto.getOrganizationId());
        e.setRating(dto.getRating());
        e.setStrengths(dto.getStrengths());
        e.setImprovements(dto.getImprovements());
        e.setComments(dto.getComments());
        e.setNextQuarterGoals(dto.getNextQuarterGoals());
        // request association must be set by caller: e.setRequest(requestEntity)
        return e;
    }

    /**
     * Convenience helper: build PerformanceReview from request entity + DTO (sets request association).
     */
    public static PerformanceReview fromRequestAndDTO(PerformanceReviewRequest request, PerformanceReviewDTO dto) {
        if (request == null || dto == null) return null;
        PerformanceReview e = toEntity(dto);
        e.setRequest(request);
        e.setOrganizationId(request.getOrganizationId());
        return e;
    }
}
