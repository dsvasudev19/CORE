package com.dev.core.mapper.bug;

import com.dev.core.domain.BugComment;
import com.dev.core.domain.Employee;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.bug.BugCommentDTO;

import java.util.stream.Collectors;

public class BugCommentMapper {

    private BugCommentMapper() {}

    // -------------------------------------------
    // TO DTO
    // -------------------------------------------
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
                .commentedBy(toMinimalEmployeeDTO(entity.getCommentedBy()))
                .commentedAt(entity.getCommentedAt())
                .bugId(entity.getBug() != null ? entity.getBug().getId() : null)
                .parentCommentId(entity.getParentComment() != null ? entity.getParentComment().getId() : null);

        if (includeReplies && entity.getReplies() != null) {
            builder.replies(
                    entity.getReplies().stream()
                            .map(reply -> toDTO(reply, true))
                            .collect(Collectors.toList())
            );
        }

        return builder.build();
    }

    // -------------------------------------------
    // TO ENTITY
    // -------------------------------------------
    public static BugComment toEntity(BugCommentDTO dto) {
        if (dto == null) return null;

        BugComment entity = new BugComment();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setCommentText(dto.getCommentText());
        entity.setCommentedBy(toEmployeeEntity(dto.getCommentedBy()));
        entity.setCommentedAt(dto.getCommentedAt());

        return entity;
    }

    // -------------------------------------------
    // HELPERS
    // -------------------------------------------

    private static MinimalEmployeeDTO toMinimalEmployeeDTO(Employee emp) {
        if (emp == null) return null;

        return MinimalEmployeeDTO.builder()
                .id(emp.getId())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .employeeCode(emp.getEmployeeCode())
                .email(emp.getEmail())
                .build();
    }

    private static Employee toEmployeeEntity(MinimalEmployeeDTO dto) {
        if (dto == null || dto.getId() == null) return null;

        Employee emp = new Employee();
        emp.setId(dto.getId());   // only ID needed (no fetch)
        return emp;
    }
}
