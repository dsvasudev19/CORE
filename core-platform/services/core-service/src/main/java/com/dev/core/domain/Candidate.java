package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "candidates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Candidate extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id", nullable = false)
    private JobPosting jobPosting;

    private String resumeUrl;

    private String coverLetterUrl;

    private String linkedinUrl;

    private String portfolioUrl;

    private String experience;

    private String education;

    private String currentCompany;

    private String currentPosition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CandidateStatus status;

    @Enumerated(EnumType.STRING)
    private CandidateStage stage;

    private LocalDate appliedDate;

    private LocalDate interviewDate;

    private Double rating;

    @Column(length = 2000)
    private String notes;

    public enum CandidateStatus {
        NEW,
        UNDER_REVIEW,
        SHORTLISTED,
        INTERVIEW_SCHEDULED,
        INTERVIEWED,
        OFFER_EXTENDED,
        HIRED,
        REJECTED,
        WITHDRAWN
    }

    public enum CandidateStage {
        INITIAL_SCREENING,
        PHONE_SCREENING,
        TECHNICAL_ROUND,
        HR_ROUND,
        FINAL_ROUND,
        OFFER_NEGOTIATION,
        BACKGROUND_CHECK
    }
}
