package com.dev.core.model;

import com.dev.core.domain.Issue;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class IssueDTO extends BaseDTO {

    private String key;
    private String summary;
    private String description;
    private Issue.IssueType type;
    private Issue.IssuePriority priority;
    private Issue.IssueStatus status;
    private Integer storyPoints;
    private Long epicId;
    private Long sprintId;
    private Long projectId;
    private Long assigneeId;
    private Long reporterId;
    private String assigneeName;
    private String epicName;
    private String sprintName;
}
