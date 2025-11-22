package com.dev.core.mapper;


import org.springframework.stereotype.Component;

import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectActivity;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.ProjectActivityDTO;
import com.dev.core.model.UserDTO;
import com.dev.core.service.EmployeeService;
import com.dev.core.service.UserService;

import lombok.RequiredArgsConstructor;

@Component

@RequiredArgsConstructor
public final class ProjectActivityMapper {
	
	private final EmployeeService employeeService;
	private final UserService userService;



    public ProjectActivityDTO toDTO(ProjectActivity entity) {
    	EmployeeDTO emp=getEmployeeDetails(entity.getPerformedBy());
        if (entity == null) return null;
        return ProjectActivityDTO.builder()
                .id(entity.getId())
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .activityType(entity.getActivityType())
                .performedBy(entity.getPerformedBy())
                .summary(entity.getSummary())
                .description(entity.getDescription())
                .metadataJson(entity.getMetadataJson())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .performer(MinimalEmployeeDTO.builder().email(emp.getEmail()).firstName(emp.getFirstName()).lastName(emp.getLastName()).email(emp.getEmail()).phone(emp.getPhone()).build())
                .build();
    }

    public ProjectActivity toEntity(ProjectActivityDTO dto, Project project, String metadataJson) {
    	
        return ProjectActivity.builder()
                .project(project)
                .activityType(dto.getActivityType())
                .performedBy(dto.getPerformedBy())
                .summary(dto.getSummary())
                .description(dto.getDescription())
                .metadataJson(metadataJson)
                .build();
    }
    
    public EmployeeDTO getEmployeeDetails(long userId) {
    	UserDTO user=userService.getUserById(userId);
    	return employeeService.getEmployeeById(user.getEmployeeProfileId());
    }
}
