package com.dev.core.mapper;

import com.dev.core.domain.Candidate;
import com.dev.core.model.CandidateDTO;

public final class CandidateMapper {

    private CandidateMapper() {}

    public static CandidateDTO toDTO(Candidate entity) {
        if (entity == null) return null;

        return CandidateDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .jobPostingId(entity.getJobPosting() != null ? entity.getJobPosting().getId() : null)
                .jobTitle(entity.getJobPosting() != null ? entity.getJobPosting().getTitle() : null)
                .resumeUrl(entity.getResumeUrl())
                .coverLetterUrl(entity.getCoverLetterUrl())
                .linkedinUrl(entity.getLinkedinUrl())
                .portfolioUrl(entity.getPortfolioUrl())
                .experience(entity.getExperience())
                .education(entity.getEducation())
                .currentCompany(entity.getCurrentCompany())
                .currentPosition(entity.getCurrentPosition())
                .status(entity.getStatus())
                .stage(entity.getStage())
                .appliedDate(entity.getAppliedDate())
                .interviewDate(entity.getInterviewDate())
                .rating(entity.getRating())
                .notes(entity.getNotes())
                .build();
    }

    public static Candidate toEntity(CandidateDTO dto) {
        if (dto == null) return null;

        Candidate candidate = Candidate.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .resumeUrl(dto.getResumeUrl())
                .coverLetterUrl(dto.getCoverLetterUrl())
                .linkedinUrl(dto.getLinkedinUrl())
                .portfolioUrl(dto.getPortfolioUrl())
                .experience(dto.getExperience())
                .education(dto.getEducation())
                .currentCompany(dto.getCurrentCompany())
                .currentPosition(dto.getCurrentPosition())
                .status(dto.getStatus())
                .stage(dto.getStage())
                .appliedDate(dto.getAppliedDate())
                .interviewDate(dto.getInterviewDate())
                .rating(dto.getRating())
                .notes(dto.getNotes())
                .build();
        
        // Set BaseEntity fields manually
        candidate.setId(dto.getId());
        candidate.setOrganizationId(dto.getOrganizationId());
        candidate.setActive(dto.getActive());
        candidate.setCreatedAt(dto.getCreatedAt());
        candidate.setUpdatedAt(dto.getUpdatedAt());
        candidate.setCreatedBy(dto.getCreatedBy());
        candidate.setUpdatedBy(dto.getUpdatedBy());
        
        return candidate;
    }
}
