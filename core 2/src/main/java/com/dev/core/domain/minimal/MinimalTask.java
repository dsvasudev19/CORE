package com.dev.core.domain.minimal;



import java.time.LocalDateTime;


import com.dev.core.constants.TaskPriority;
import com.dev.core.constants.TaskStatus;
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
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MinimalTask {

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
    private MinimalEmployeeDTO owner;     // NEW - full object returned

    private Integer progressPercentage;

}

