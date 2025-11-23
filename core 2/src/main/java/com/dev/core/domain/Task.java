package com.dev.core.domain;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.dev.core.constants.TaskPriority;
import com.dev.core.constants.TaskStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tasks",
       indexes = {
           @Index(columnList = "project_id"),
           @Index(columnList = "organization_id"),
           @Index(columnList = "status"),
           @Index(columnList = "priority")
       })
@Getter
@Setter
@NoArgsConstructor
public class Task extends BaseEntity {

    @Column(name = "title", nullable = false, length = 250)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private TaskStatus status = TaskStatus.BACKLOG;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 32)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "estimated_hours")
    private Double estimatedHours;

    @Column(name = "actual_hours")
    private Double actualHours;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "phase_id")
    private Long phaseId; // optional link to ProjectPhase

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = true)
    private Project project;

    /**
     * Parent task (for subtask hierarchy)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;

    /**
     * Self-referencing subtasks
     */
    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Task> subtasks = new HashSet<>();

    /**
     * Assignees (multiple)
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "task_assignees",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"),
            uniqueConstraints = {@UniqueConstraint(columnNames = {"task_id", "employee_id"})})
    private Set<Employee> assignees = new HashSet<>();

    /**
     * Primary owner
     */
    @Column(name = "owner_id")
    private Long ownerId;
    
    
   

    /**
     * Tags for categorization
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
    	    name = "task_tag_links",  // ← NEW NAME
    	    joinColumns = @JoinColumn(name = "task_id"),
    	    inverseJoinColumns = @JoinColumn(name = "tag_id")
    	)

    private Set<TaskTag> tags = new HashSet<>();

   
    /**
     * Dependencies (tasks this one depends on)
     */
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TaskDependency> dependencies = new HashSet<>();

    /**
     * Comments
     */
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TaskComment> comments = new HashSet<>();

    /**
     * Attachments
     */
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TaskAttachment> attachments = new HashSet<>();

    /**
     * Progress % for analytics
     */
    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;
}
