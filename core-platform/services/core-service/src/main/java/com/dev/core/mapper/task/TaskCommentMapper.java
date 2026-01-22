package com.dev.core.mapper.task;

import org.springframework.stereotype.Component;

import com.dev.core.domain.TaskComment;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.task.TaskCommentDTO;
import com.dev.core.service.EmployeeService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.UtilityClass;

@Component
@RequiredArgsConstructor
public class TaskCommentMapper {
	private final EmployeeService employeeService;

    public TaskCommentDTO toDTO(TaskComment entity) {
    	
        if (entity == null) return null;
        
        EmployeeDTO empDTO=employeeService.getEmployeeById(entity.getCommentedBy());
        
        return TaskCommentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .taskId(entity.getTask() != null ? entity.getTask().getId() : null)
                .commentText(entity.getCommentText())
                .commentedBy(entity.getCommentedBy())
                .commentedAt(entity.getCommentedAt())
                .parentCommentId(entity.getParentCommentId())
                .commenter(MinimalEmployeeDTO.builder().email(empDTO.getEmail()).phone(empDTO.getPhone()).firstName(empDTO.getFirstName()).lastName(empDTO.getLastName()).employeeCode(empDTO.getEmployeeCode()).build())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public TaskComment toEntity(TaskCommentDTO dto) {
        if (dto == null) return null;
        TaskComment entity = new TaskComment();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCommentText(dto.getCommentText());
        entity.setCommentedBy(dto.getCommentedBy());
        entity.setCommentedAt(dto.getCommentedAt());
        entity.setParentCommentId(dto.getParentCommentId());
        entity.setActive(dto.getActive());
        return entity;
    }
}
