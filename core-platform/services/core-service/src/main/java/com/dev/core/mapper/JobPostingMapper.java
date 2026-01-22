package com.dev.core.mapper;

import com.dev.core.domain.JobPosting;
import com.dev.core.model.JobPostingDTO;

public final class JobPostingMapper {

    private JobPostingMapper() {}

    public static JobPostingDTO toDTO(JobPosting entity) {
        if (entity == null) return null;

        return JobPostingDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .requirements(entity.getRequirements())
                .responsibilities(entity.getResponsibilities())
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getId() : null)
                .departmentName(entity.getDepartment() != null ? entity.getDepartment().getName() : null)
                .location(entity.getLocation())
                .type(entity.getType())
                .salaryRange(entity.getSalaryRange())
                .status(entity.getStatus())
                .urgency(entity.getUrgency())
                .postedDate(entity.getPostedDate())
                .closingDate(entity.getClosingDate())
                .openings(entity.getOpenings())
                .build();
    }

    public static JobPosting toEntity(JobPostingDTO dto) {
        if (dto == null) return null;

        JobPosting jobPosting = JobPosting.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requirements(dto.getRequirements())
                .responsibilities(dto.getResponsibilities())
                .location(dto.getLocation())
                .type(dto.getType())
                .salaryRange(dto.getSalaryRange())
                .status(dto.getStatus())
                .urgency(dto.getUrgency())
                .postedDate(dto.getPostedDate())
                .closingDate(dto.getClosingDate())
                .openings(dto.getOpenings())
                .build();
        
        // Set BaseEntity fields manually
        jobPosting.setId(dto.getId());
        jobPosting.setOrganizationId(dto.getOrganizationId());
        jobPosting.setActive(dto.getActive());
        jobPosting.setCreatedAt(dto.getCreatedAt());
        jobPosting.setUpdatedAt(dto.getUpdatedAt());
        jobPosting.setCreatedBy(dto.getCreatedBy());
        jobPosting.setUpdatedBy(dto.getUpdatedBy());
        
        return jobPosting;
    }
}
