package com.dev.core.model;

import com.dev.core.domain.Candidate;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CandidateDTO extends BaseDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long jobPostingId;
    private String jobTitle;
    private String resumeUrl;
    private String coverLetterUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String experience;
    private String education;
    private String currentCompany;
    private String currentPosition;
    private Candidate.CandidateStatus status;
    private Candidate.CandidateStage stage;
    private LocalDate appliedDate;
    private LocalDate interviewDate;
    private Double rating;
    private String notes;
}
