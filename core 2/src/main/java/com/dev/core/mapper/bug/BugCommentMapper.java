package com.dev.core.mapper.bug;

import com.dev.core.domain.BugComment;
import com.dev.core.model.bug.BugCommentDTO;
import java.util.stream.Collectors;

public class BugCommentMapper {

    private BugCommentMapper() {}

    public static BugCommentDTO toDTO(BugComment entity) {
        return toDTO(entity, false);
    }

    public static BugCommentDTO toDTO(BugComment entity, boolean includeReplies) {
        if (entity == null) return null;

        BugCommentDTO.BugCommentDTOBuilder<?, ?> builder = BugCommentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .commentText(entity.getCommentText())
                .commentedBy(entity.getCommentedBy())
                .commentedAt(entity.getCommentedAt())
                .bugId(entity.getBug() != null ? entity.getBug().getId() : null)
                .parentCommentId(entity.getParentComment() != null ? entity.getParentComment().getId() : null);

        if (includeReplies && entity.getReplies() != null)
            builder.replies(entity.getReplies().stream()
                    .map(reply -> toDTO(reply, true))
                    .collect(Collectors.toList()));

        return builder.build();
    }

    public static BugComment toEntity(BugCommentDTO dto) {
        if (dto == null) return null;

        BugComment entity = new BugComment();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setCommentText(dto.getCommentText());
        entity.setCommentedBy(dto.getCommentedBy());
        entity.setCommentedAt(dto.getCommentedAt());
        return entity;
    }
}
