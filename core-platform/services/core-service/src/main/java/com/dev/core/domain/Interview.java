package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Interview extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "interviewer_id")
    private Employee interviewer;

    @Column(nullable = false)
    private LocalDateTime scheduledDateTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewMode mode;

    @Column(length = 500)
    private String location;

    @Column(length = 500)
    private String meetingLink;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    @Column(length = 2000)
    private String notes;

    @Column(length = 2000)
    private String feedback;

    private Double rating;

    @Enumerated(EnumType.STRING)
    private InterviewResult result;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private Long organizationId;

    public enum InterviewType {
        PHONE_SCREENING,
        TECHNICAL_ROUND,
        HR_ROUND,
        MANAGERIAL_ROUND,
        FINAL_ROUND,
        CULTURAL_FIT
    }

    public enum InterviewMode {
        IN_PERSON,
        VIDEO_CALL,
        PHONE_CALL
    }

    public enum InterviewStatus {
        SCHEDULED,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        RESCHEDULED,
        NO_SHOW
    }

    public enum InterviewResult {
        PASSED,
        FAILED,
        ON_HOLD,
        NEEDS_ANOTHER_ROUND
    }
}
