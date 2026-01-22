package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "job_postings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class JobPosting extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String description;

    @Column(length = 2000)
    private String requirements;

    @Column(length = 2000)
    private String responsibilities;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobType type;

    private String salaryRange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @Enumerated(EnumType.STRING)
    private JobUrgency urgency;

    private LocalDate postedDate;

    private LocalDate closingDate;

    private Integer openings;

    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL)
    private Set<Candidate> candidates;

    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        INTERNSHIP
    }

    public enum JobStatus {
        DRAFT,
        ACTIVE,
        CLOSED,
        ON_HOLD
    }

    public enum JobUrgency {
        HIGH,
        MEDIUM,
        LOW
    }
}
