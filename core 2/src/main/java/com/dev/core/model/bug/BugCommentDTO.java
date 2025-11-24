package com.dev.core.model.bug;

import com.dev.core.model.BaseDTO;
import com.dev.core.model.MinimalEmployeeDTO;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BugCommentDTO extends BaseDTO {

    private Long bugId;
    private String commentText;
    private MinimalEmployeeDTO commentedBy;

    private LocalDateTime commentedAt;

    private Long parentCommentId;
    private List<BugCommentDTO> replies;
}
