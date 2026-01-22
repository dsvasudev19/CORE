
package com.dev.core.model.task;

import java.time.LocalDateTime;
import java.util.Set;

import com.dev.core.constants.TaskPriority;
import com.dev.core.constants.TaskStatus;
import com.dev.core.domain.minimal.MinimalTask;
import com.dev.core.model.BaseDTO;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.MinimalEmployeeDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO extends BaseDTO {

    private String title;
    private String description;

    private TaskStatus status;
    private TaskPriority priority;

    private LocalDateTime startDate;
    private LocalDateTime dueDate;
    private Double estimatedHours;
    private Double actualHours;
    private LocalDateTime completedAt;

    private Long phaseId;
    private Long projectId;
    private Long parentTaskId;

    // Old: ownerId
    private Long ownerId;          // still needed for saving
    private EmployeeDTO owner;     // NEW - full object returned

    private Integer progressPercentage;

    // Old: Set<Long> assigneeIds
    private Set<Long> assigneeIds;            // still needed for sending
    private Set<MinimalEmployeeDTO> assignees;       // NEW - full objects returned

    private Set<TaskTagDTO> tags;
    private Set<TaskDependencyDTO> dependencies;
    private Set<TaskCommentDTO> comments;
    private Set<TaskAttachmentDTO> attachments;

    private Set<MinimalTask> subtasks;
}

