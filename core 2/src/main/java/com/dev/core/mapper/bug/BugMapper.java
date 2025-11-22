package com.dev.core.mapper.bug;

import com.dev.core.domain.Bug;
import com.dev.core.mapper.ProjectMapper;
import com.dev.core.mapper.options.BugMapperOptions;
import com.dev.core.mapper.task.TaskMapper;
import com.dev.core.model.bug.*;

import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
@RequiredArgsConstructor
@Component
public class BugMapper {

    private final TaskMapper taskmapper;

    public BugDTO toDTO(Bug entity) {
        return toDTO(entity, BugMapperOptions.builder().build());
    }

    public BugDTO toDTO(Bug entity, BugMapperOptions options) {
        if (entity == null) return null;
        if (options == null) options = BugMapperOptions.builder().build();

        BugDTO.BugDTOBuilder<?, ?> builder = BugDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .severity(entity.getSeverity())
                .environment(entity.getEnvironment())
                .appVersion(entity.getAppVersion())
                .reportedBy(entity.getReportedBy())
                .assignedTo(entity.getAssignedTo())
                .verifiedBy(entity.getVerifiedBy())
                .dueDate(entity.getDueDate())
                .resolvedAt(entity.getResolvedAt())
                .closedAt(entity.getClosedAt())
                .reopenCount(entity.getReopenCount())
                .commitReference(entity.getCommitReference());

        // 🔹 Include optional relations based on options
        if (options.isIncludeProject() && entity.getProject() != null)
            builder.project(ProjectMapper.toDTO(entity.getProject()));

        if (options.isIncludeLinkedTask() && entity.getLinkedTask() != null)
            builder.linkedTask(taskmapper.toDTO(entity.getLinkedTask()));

        if (options.isIncludeComments() && entity.getComments() != null)
            builder.comments(entity.getComments().stream()
                    .map(c -> BugCommentMapper.toDTO(c, true))
                    .collect(Collectors.toSet()));

        if (options.isIncludeAttachments() && entity.getAttachments() != null)
            builder.attachments(entity.getAttachments().stream()
                    .map(BugAttachmentMapper::toDTO)
                    .collect(Collectors.toSet()));

        if (options.isIncludeHistory() && entity.getHistoryEntries() != null)
            builder.historyEntries(entity.getHistoryEntries().stream()
                    .map(BugHistoryMapper::toDTO)
                    .collect(Collectors.toList()));

        return builder.build();
    }

    public Bug toEntity(BugDTO dto) {
        if (dto == null) return null;

        Bug entity = new Bug();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        entity.setSeverity(dto.getSeverity());
        entity.setEnvironment(dto.getEnvironment());
        entity.setAppVersion(dto.getAppVersion());
        entity.setReportedBy(dto.getReportedBy());
        entity.setAssignedTo(dto.getAssignedTo());
        entity.setVerifiedBy(dto.getVerifiedBy());
        entity.setDueDate(dto.getDueDate());
        entity.setResolvedAt(dto.getResolvedAt());
        entity.setClosedAt(dto.getClosedAt());
        entity.setReopenCount(dto.getReopenCount());
        entity.setCommitReference(dto.getCommitReference());
        return entity;
    }
}
