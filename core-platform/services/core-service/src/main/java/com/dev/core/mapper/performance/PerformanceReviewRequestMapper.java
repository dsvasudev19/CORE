package com.dev.core.mapper.performance;

import com.dev.core.constants.ReviewStatus;
import com.dev.core.constants.ReviewType;
import com.dev.core.domain.performance.PerformanceReviewRequest;
import com.dev.core.mapper.MinimalEmployeeMapper;
import com.dev.core.model.performance.MinimalPerformanceReviewRequestDTO;
import com.dev.core.model.performance.PerformanceReviewRequestDTO;

public final class PerformanceReviewRequestMapper {

    private PerformanceReviewRequestMapper() {}

    public static PerformanceReviewRequestDTO toDTO(PerformanceReviewRequest entity) {
        if (entity == null) return null;

        PerformanceReviewRequestDTO dto = PerformanceReviewRequestDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .cycleId(entity.getCycle() != null ? entity.getCycle().getId() : null)
                .cycle(PerformanceCycleMapper.toDTO(entity.getCycle()))
                .reviewerId(entity.getReviewer() != null ? entity.getReviewer().getId() : null)
                .reviewer(MinimalEmployeeMapper.toMinimalDTO(entity.getReviewer()))
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .employee(MinimalEmployeeMapper.toMinimalDTO(entity.getEmployee()))
                .type(entity.getType() != null ? entity.getType().name() : null)
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .submittedAt(entity.getSubmittedAt())
                .note(entity.getNote())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();

        return dto;
    }

    /**
     * Minimal DTO used for lists (small payload).
     */
    public static MinimalPerformanceReviewRequestDTO toMinimal(PerformanceReviewRequest entity) {
        if (entity == null) return null;

        MinimalPerformanceReviewRequestDTO m = new MinimalPerformanceReviewRequestDTO();
        m.setId(entity.getId());
        m.setEmployeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null);
        m.setEmployeeName(entity.getEmployee() != null ? entity.getEmployee().getFullName() : null);
        m.setReviewerId(entity.getReviewer() != null ? entity.getReviewer().getId() : null);
        m.setReviewerName(entity.getReviewer() != null ? entity.getReviewer().getFullName() : null);
        m.setType(entity.getType() != null ? entity.getType().name() : null);
        m.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        return m;
    }

    /**
     * Build entity from DTO. Useful if you ever create requests from an API.
     * Note: caller must set cycle/reviewer/employee associations (this method sets IDs only where applicable).
     */
    public static PerformanceReviewRequest toEntity(PerformanceReviewRequestDTO dto) {
        if (dto == null) return null;
        PerformanceReviewRequest e = new PerformanceReviewRequest();
        if (dto.getId() != null) e.setId(dto.getId());
        e.setOrganizationId(dto.getOrganizationId());
        // cycle, reviewer, employee associations should be set by caller (service) after fetching entities
        if (dto.getType() != null) {
            try {
                e.setType(ReviewType.valueOf(dto.getType()));
            } catch (IllegalArgumentException ex) {
                e.setType(null);
            }
        }
        if (dto.getStatus() != null) {
            try {
                e.setStatus(ReviewStatus.valueOf(dto.getStatus()));
            } catch (IllegalArgumentException ex) {
                e.setStatus(null);
            }
        }
        e.setSubmittedAt(dto.getSubmittedAt());
        e.setNote(dto.getNote());
        return e;
    }
}
