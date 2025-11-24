

package com.dev.core.mapper.todo;

import com.dev.core.domain.Employee;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.domain.Todo;
import com.dev.core.domain.minimal.MinimalProject;
import com.dev.core.domain.minimal.MinimalTask;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.TodoDTO;

public class TodoMapper {

    private TodoMapper() {}

    // ----------------------------------------------------------------------
    // Convert Entity -> DTO
    // ----------------------------------------------------------------------
    public static TodoDTO toDTO(Todo entity) {
        if (entity == null) return null;

        return TodoDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .type(entity.getType())
                .dueDate(entity.getDueDate())
                .completedAt(entity.getCompletedAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())

                .assignee(toMinimalEmployee(entity.getAssignee()))
                .project(toMinimalProject(entity.getProject()))
                .task(toMinimalTask(entity.getTask()))
                .build();
    }

    // ----------------------------------------------------------------------
    // Convert DTO -> Entity (ID-only references for associations)
    // ----------------------------------------------------------------------
    public static Todo toEntity(TodoDTO dto) {
        if (dto == null) return null;

        Todo entity = new Todo();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        entity.setPriority(dto.getPriority());
        entity.setType(dto.getType());
        entity.setDueDate(dto.getDueDate());
        entity.setCompletedAt(dto.getCompletedAt());

        // Set minimal associations via IDs (no full loading here)
        if (dto.getAssignee() != null && dto.getAssignee().getId() != null) {
            Employee e = new Employee();
            e.setId(dto.getAssignee().getId());
            entity.setAssignee(e);
        }

        if (dto.getProject() != null && dto.getProject().getCode() != null) {
            Project p = new Project();
            p.setCode(dto.getProject().getCode()); // CODE uniquely identifies project in your model
            entity.setProject(p);
        }

        if (dto.getTask() != null && dto.getTask().getId() != null) {
            Task t = new Task();
            t.setId(dto.getTask().getId());
            entity.setTask(t);
        }

        return entity;
    }

    // ----------------------------------------------------------------------
    // Minimal Converters
    // ----------------------------------------------------------------------

    private static MinimalEmployeeDTO toMinimalEmployee(Employee e) {
        if (e == null) return null;

        return MinimalEmployeeDTO.builder()
                .id(e.getId())
                .employeeCode(e.getEmployeeCode())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .email(e.getEmail())
                .phone(e.getPhone())
                .build();
    }

    private static MinimalProject toMinimalProject(Project p) {
        if (p == null) return null;

        return MinimalProject.builder()
                .name(p.getName())
                .code(p.getCode())
                .build();
    }

    private static MinimalTask toMinimalTask(Task t) {
        if (t == null) return null;

        return MinimalTask.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus())
                .priority(t.getPriority())
                .startDate(t.getStartDate())
                .dueDate(t.getDueDate())
                .estimatedHours(t.getEstimatedHours())
                .actualHours(t.getActualHours())
                .completedAt(t.getCompletedAt())
                
                .progressPercentage(t.getProgressPercentage())
                .build();
    }
}
