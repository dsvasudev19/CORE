package com.dev.core.model.task;


import com.dev.core.model.BaseDTO;
import com.dev.core.model.MinimalEmployeeDTO;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCommentDTO extends BaseDTO {

    private Long taskId;
    private String commentText;
    private Long commentedBy;
    private LocalDateTime commentedAt;
    private Long parentCommentId;
    private MinimalEmployeeDTO commenter;

    private List<TaskCommentDTO> replies; // nested comments (optional)
}
