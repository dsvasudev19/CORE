package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issues")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Issue extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String summary;

    @Column(length = 5000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssuePriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status;

    private Integer storyPoints;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "epic_id")
    private Epic epic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private Employee assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id")
    private Employee reporter;

    public enum IssueType {
        STORY,
        TASK,
        BUG,
        EPIC
    }

    public enum IssuePriority {
        HIGHEST,
        HIGH,
        MEDIUM,
        LOW,
        LOWEST
    }

    public enum IssueStatus {
        TO_DO,
        IN_PROGRESS,
        IN_REVIEW,
        DONE,
        CANCELLED
    }
}
