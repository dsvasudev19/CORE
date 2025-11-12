

package com.dev.core.model.task;

import java.time.LocalDateTime;
import java.util.Set;

import com.dev.core.constants.TaskPriority;
import com.dev.core.constants.TaskStatus;
import com.dev.core.model.BaseDTO;

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
    private Long ownerId;
    private Integer progressPercentage;

    private Set<Long> assigneeIds;
    private Set<TaskTagDTO> tags;
    private Set<TaskDependencyDTO> dependencies;
    private Set<TaskCommentDTO> comments;
    private Set<TaskAttachmentDTO> attachments;
    private Set<TaskDTO> subtasks;
}
