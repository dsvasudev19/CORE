package com.dev.core.model.bug;

import com.dev.core.constants.BugSeverity;
import com.dev.core.constants.BugStatus;
import com.dev.core.domain.minimal.MinimalProject;
import com.dev.core.domain.minimal.MinimalTask;
import com.dev.core.model.BaseDTO;
import lombok.*;

import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.dev.core.model.MinimalEmployeeDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BugDTO extends BaseDTO {

    private String title;
    private String description;
    private BugStatus status;
    private BugSeverity severity;
    private String environment;
    private String appVersion;

    private MinimalProject project;
    private MinimalTask linkedTask;

    private MinimalEmployeeDTO reportedBy;
    private MinimalEmployeeDTO assignedTo;
    private MinimalEmployeeDTO verifiedBy;

    private LocalDateTime dueDate;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    private Integer reopenCount;
    private String commitReference;

    private Set<BugAttachmentDTO> attachments;
    private Set<BugCommentDTO> comments;
    private List<BugHistoryDTO> historyEntries;
}
