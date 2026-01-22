package com.dev.core.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.dev.core.constants.TodoPriority;
import com.dev.core.constants.TodoStatus;
import com.dev.core.constants.TodoType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "todos",
    indexes = {
        @Index(columnList = "organization_id"),
        @Index(columnList = "status"),
        @Index(columnList = "assignee_id"),
        @Index(columnList = "due_date"),
        @Index(columnList = "project_id"),
        @Index(columnList = "task_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo extends BaseEntity {

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TodoStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TodoPriority priority;

    private LocalDate dueDate;

    private LocalDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private Employee assignee;

    // OPTIONAL link to project
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = true)
    private Project project;

    // OPTIONAL link to task (task implicitly belongs to a project)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = true)
    private Task task;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TodoType type;
}
