package com.dev.core.domain;

import com.dev.core.constants.BugSeverity;
import com.dev.core.constants.BugStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "bugs", indexes = {
        @Index(columnList = "project_id"),
        @Index(columnList = "task_id"),
        @Index(columnList = "status"),
        @Index(columnList = "severity")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bug extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private BugStatus status = BugStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private BugSeverity severity = BugSeverity.MEDIUM;

    @Column(length = 100)
    private String environment; // e.g. "Chrome 120 / Windows 11"

    @Column(length = 100)
    private String appVersion; // e.g. "v1.3.5"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task linkedTask;

    @Column(name = "reported_by")
    private Long reportedBy;

    @Column(name = "assigned_to")
    private Long assignedTo;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "reopen_count")
    private Integer reopenCount = 0;

    @Column(name = "commit_reference")
    private String commitReference;

    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BugAttachment> attachments;

    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BugComment> comments;

    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BugHistory> historyEntries;
}
