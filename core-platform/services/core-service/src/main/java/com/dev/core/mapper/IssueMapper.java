package com.dev.core.mapper;

import com.dev.core.domain.Issue;
import com.dev.core.model.IssueDTO;

public final class IssueMapper {

    private IssueMapper() {}

    public static IssueDTO toDTO(Issue entity) {
        if (entity == null) return null;

        return IssueDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .key(entity.getKey())
                .summary(entity.getSummary())
                .description(entity.getDescription())
                .type(entity.getType())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .storyPoints(entity.getStoryPoints())
                .epicId(entity.getEpic() != null ? entity.getEpic().getId() : null)
                .sprintId(entity.getSprint() != null ? entity.getSprint().getId() : null)
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .assigneeId(entity.getAssignee() != null ? entity.getAssignee().getId() : null)
                .reporterId(entity.getReporter() != null ? entity.getReporter().getId() : null)
                .assigneeName(entity.getAssignee() != null ? 
                    entity.getAssignee().getFirstName() + " " + entity.getAssignee().getLastName() : null)
                .epicName(entity.getEpic() != null ? entity.getEpic().getName() : null)
                .sprintName(entity.getSprint() != null ? entity.getSprint().getName() : null)
                .build();
    }

    public static Issue toEntity(IssueDTO dto) {
        if (dto == null) return null;

        Issue issue = Issue.builder()
                .key(dto.getKey())
                .summary(dto.getSummary())
                .description(dto.getDescription())
                .type(dto.getType())
                .priority(dto.getPriority())
                .status(dto.getStatus())
                .storyPoints(dto.getStoryPoints())
                .build();
        
        // Set BaseEntity fields manually
        issue.setId(dto.getId());
        issue.setOrganizationId(dto.getOrganizationId());
        issue.setActive(dto.getActive());
        issue.setCreatedAt(dto.getCreatedAt());
        issue.setUpdatedAt(dto.getUpdatedAt());
        issue.setCreatedBy(dto.getCreatedBy());
        issue.setUpdatedBy(dto.getUpdatedBy());
        
        return issue;
    }
}
