package com.dev.core.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.dev.core.constants.TodoPriority;
import com.dev.core.constants.TodoStatus;
import com.dev.core.constants.TodoType;
import com.dev.core.domain.minimal.MinimalProject;
import com.dev.core.domain.minimal.MinimalTask;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoDTO {
    private Long id;
    private Long organizationId;

    private String title;
    private String description;
    private TodoStatus status;
    private TodoPriority priority;
    private TodoType type;

    private LocalDate dueDate;
    private LocalDateTime completedAt;

    private MinimalEmployeeDTO assignee;
    private MinimalProject project;
    private MinimalTask task;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

