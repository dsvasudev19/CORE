package com.dev.core.model.bug;

import com.dev.core.constants.BugSeverity;
import com.dev.core.constants.BugStatus;
import com.dev.core.model.BaseDTO;
import com.dev.core.model.ProjectDTO;
import com.dev.core.model.task.TaskDTO;
import lombok.*;

import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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

    private ProjectDTO project;
    private TaskDTO linkedTask;

    private Long reportedBy;
    private Long assignedTo;
    private Long verifiedBy;

    private LocalDateTime dueDate;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    private Integer reopenCount;
    private String commitReference;

    private Set<BugAttachmentDTO> attachments;
    private Set<BugCommentDTO> comments;
    private List<BugHistoryDTO> historyEntries;
}
