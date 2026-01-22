package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "time_logs", indexes = {
        @Index(columnList = "user_id"),
        @Index(columnList = "task_id"),
        @Index(columnList = "bug_id"),
        @Index(columnList = "project_id"),
        @Index(columnList = "active"),
        @Index(columnList = "organization_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeLog extends BaseEntity {

    // -------------------------------
    // User tracking
    // -------------------------------
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // -------------------------------
    // Time capture
    // -------------------------------
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "duration_minutes")
    private Long durationMinutes;

    // -------------------------------
    // AUTO-DERIVED Associations
    // -------------------------------

    /** Derived from task or bug at the time of logging */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    /** Optional: user selected */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    /** Optional: user selected */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bug_id")
    private Bug bug;
    
    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;


    // -------------------------------
    // Description / Note
    // -------------------------------
    @Column(length = 500)
    private String note;

    // -------------------------------
    // Active Session Flag
    // -------------------------------
    @Column(name = "active", nullable = false)
    private boolean active = true;
}
