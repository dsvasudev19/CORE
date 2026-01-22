package com.dev.core.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "task_dependencies",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"task_id", "depends_on_task_id"})})
@Getter
@Setter
@NoArgsConstructor
public class TaskDependency extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "depends_on_task_id", nullable = false)
    private Task dependsOn;

    @Column(name = "dependency_type", length = 50)
    private String dependencyType; // e.g., BLOCKER, BLOCKED_BY
}
