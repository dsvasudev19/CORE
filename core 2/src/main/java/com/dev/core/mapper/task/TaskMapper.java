package com.dev.core.mapper.task;

import com.dev.core.domain.*;
import com.dev.core.domain.minimal.*;
import com.dev.core.mapper.options.TaskMapperOptions;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.task.*;
import com.dev.core.repository.task.TaskTagRepository;
import com.dev.core.security.SecurityContextUtil;

import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class TaskMapper {
	
	private final SecurityContextUtil securityContextUtil;
    private final TaskTagRepository taskTagRepository;
    private final TaskCommentMapper taskCommentMapper;


    public TaskDTO toDTO(Task entity) {
        return toDTO(entity, TaskMapperOptions.builder()
                .includeAttachments(true)
                .includeComments(true)
                .includeDependencies(true)
                .includeTags(true)
                .includeSubtasks(true)
                .build());
    }

    @SuppressWarnings("unchecked")
	public TaskDTO toDTO(Task entity, TaskMapperOptions options) {
        if (entity == null) return null;
        MinimalEmployeeDTO empDTO=securityContextUtil.getCurrentEmployee();
        TaskDTO.TaskDTOBuilder<?, ?> builder = TaskDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .startDate(entity.getStartDate())
                .dueDate(entity.getDueDate())
                .estimatedHours(entity.getEstimatedHours())
                .actualHours(entity.getActualHours())
                .completedAt(entity.getCompletedAt())
                .phaseId(entity.getPhaseId())
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .parentTaskId(entity.getParentTask() != null ? entity.getParentTask().getId() : null)
                .ownerId(entity.getOwnerId())
                .owner(EmployeeDTO.builder().id(entity.getOwnerId()).email(empDTO.getEmail()).firstName(empDTO.getFirstName()).lastName(empDTO.getLastName()).phone(empDTO.getPhone()).build())
                .progressPercentage(entity.getProgressPercentage())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive());

        if (options.isIncludeTags() && entity.getTags() != null) {
            builder.tags(entity.getTags().stream()
                    .map(TaskTagMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        if (options.isIncludeDependencies() && entity.getDependencies() != null) {
            builder.dependencies(entity.getDependencies().stream()
                    .map(TaskDependencyMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        if (options.isIncludeAttachments() && entity.getAttachments() != null) {
            builder.attachments(entity.getAttachments().stream()
                    .map(TaskAttachmentMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        if (options.isIncludeComments() && entity.getComments() != null) {
            builder.comments(entity.getComments().stream()
                    .map(taskCommentMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        builder.subtasks((Set<MinimalTask>)
                entity.getSubtasks().stream()
                        .map(sub -> MinimalTask.builder()
                               
                                .title(sub.getTitle())
                                .description(sub.getDescription())
                                .status(sub.getStatus())
                                .priority(sub.getPriority())
                                .startDate(sub.getStartDate())
                                .dueDate(sub.getDueDate())
                                .estimatedHours(sub.getEstimatedHours())
                                .actualHours(sub.getActualHours())
                                .completedAt(sub.getCompletedAt())
                                .phaseId(sub.getPhaseId())
                                .projectId(sub.getProject() != null ? sub.getProject().getId() : null)
                                .parentTaskId(sub.getParentTask() != null ? sub.getParentTask().getId() : null)
                                .ownerId(sub.getOwnerId())
                          
                                .progressPercentage(sub.getProgressPercentage())
                                .build())
                        .collect(Collectors.toSet())
        );



        if (entity.getAssignees() != null) {
            builder.assigneeIds(
                    entity.getAssignees().stream()
                            .map(Employee::getId)
                            .collect(Collectors.toSet())
            );

            builder.assignees(
                    entity.getAssignees().stream()
                            .map(emp -> MinimalEmployeeDTO.builder()
                                    .id(emp.getId())
                                    .employeeCode(emp.getEmployeeCode())
                                    .firstName(emp.getFirstName())
                                    .lastName(emp.getLastName())
                                    .email(emp.getEmail())
                                    .phone(emp.getPhone())
                                    .build()
                            )
                            .collect(Collectors.toSet())
            );

        }


        return builder.build();
    }

    
    public Task toEntity(TaskDTO dto, Project project) {
        if (dto == null) return null;
        Task entity = new Task();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        entity.setPriority(dto.getPriority());
        entity.setStartDate(dto.getStartDate());
        entity.setDueDate(dto.getDueDate());
        entity.setEstimatedHours(dto.getEstimatedHours());
        entity.setActualHours(dto.getActualHours());
        entity.setCompletedAt(dto.getCompletedAt());
        entity.setPhaseId(dto.getPhaseId());
        entity.setOwnerId(dto.getOwnerId());
        entity.setProject(project);
        entity.setProgressPercentage(dto.getProgressPercentage());
        entity.setActive(dto.getActive());
        Set<TaskTag> savedTags = dto.getTags() != null
                ? dto.getTags().stream()
                    .map(tagDto -> {
                        TaskTag tag = TaskTagMapper.toEntity(tagDto);
                        return taskTagRepository.save(tag);
                    })
                    .collect(Collectors.toSet())
                : Collections.emptySet();

        entity.setTags(savedTags);


        return entity;
    }
}
