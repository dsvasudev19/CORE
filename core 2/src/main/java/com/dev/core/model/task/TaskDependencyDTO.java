package com.dev.core.model.task;


import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDependencyDTO extends BaseDTO {

    private Long taskId;
    private Long dependsOnTaskId;
    private String dependencyType; // e.g., BLOCKER, BLOCKED_BY
}
