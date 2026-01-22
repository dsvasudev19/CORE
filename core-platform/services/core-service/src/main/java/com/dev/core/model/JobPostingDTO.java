package com.dev.core.model;

import com.dev.core.domain.JobPosting;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class JobPostingDTO extends BaseDTO {

    private String title;
    private String description;
    private String requirements;
    private String responsibilities;
    private Long departmentId;
    private String departmentName;
    private String location;
    private JobPosting.JobType type;
    private String salaryRange;
    private JobPosting.JobStatus status;
    private JobPosting.JobUrgency urgency;
    private LocalDate postedDate;
    private LocalDate closingDate;
    private Integer openings;
    private Integer applicantsCount;
    private Integer shortlistedCount;
    private Integer interviewedCount;
}
