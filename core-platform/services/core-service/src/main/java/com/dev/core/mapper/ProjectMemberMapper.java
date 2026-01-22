package com.dev.core.mapper;

import org.springframework.stereotype.Component;

import com.dev.core.domain.Employee;
import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectMember;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.ProjectMemberDTO;
import com.dev.core.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public final class ProjectMemberMapper {



    // ------------------------------------------------------------
    // DEEP MAPPERS (Includes Project, User)
    // ------------------------------------------------------------

    public static ProjectMemberDTO toDTO(ProjectMember entity) {
    	if (entity == null) return null;

        return ProjectMemberDTO.builder()
                // Base fields
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())

                // Member fields
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .userId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .role(entity.getRole())
                .hourlyRate(entity.getHourlyRate())
                .activeMember(entity.getActiveMember())
                .joinedAt(entity.getJoinedAt())
                .employee(entity.getEmployee() != null 
                ? new MinimalEmployeeDTO(entity.getEmployee().getId(),entity.getEmployee().getEmployeeCode(), entity.getEmployee().getFirstName(),entity.getEmployee().getLastName(),entity.getEmployee().getEmail(),entity.getEmployee().getPhone())                : null)
                .lastActivity(entity.getLastActivity())
                   .build();
    }

    public static ProjectMember toEntity(ProjectMemberDTO dto) {
        if (dto == null) return null;

        ProjectMember entity = new ProjectMember();

        // Base fields
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        // Relations (only set objects with IDs → avoids DB fetch here)
        if (dto.getProjectId() != null) {
            Project p = new Project();
            p.setId(dto.getProjectId());
            entity.setProject(p);
        }

        if (dto.getUserId() != null) {
            Employee u = new Employee();
            u.setId(dto.getId());
            entity.setEmployee(u);
        }

        // Member fields
        entity.setRole(dto.getRole());
        entity.setHourlyRate(dto.getHourlyRate());
        entity.setActiveMember(dto.getActiveMember());
        entity.setJoinedAt(dto.getJoinedAt());
        entity.setLastActivity(dto.getLastActivity());

        return entity;
    }

    // ------------------------------------------------------------
    // SHALLOW MAPPERS (No relations: projectId/userId ignored)
    // ------------------------------------------------------------

    public static ProjectMemberDTO toShallowDTO(ProjectMember entity) {
        if (entity == null) return null;

        return ProjectMemberDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())

                // Only shallow fields (ignoring project/user)
                .role(entity.getRole())
                .hourlyRate(entity.getHourlyRate())
                .activeMember(entity.getActiveMember())
                .joinedAt(entity.getJoinedAt())
                .lastActivity(entity.getLastActivity())
                .employee(entity.getEmployee() != null 
                ? new MinimalEmployeeDTO(entity.getEmployee().getId(), entity.getEmployee().getFirstName(),entity.getEmployee().getLastName(),entity.getEmployee().getEmail(),entity.getEmployee().getEmployeeCode(),entity.getEmployee().getPhone())                : null)
                .build();
    }

    public static ProjectMember toShallowEntity(ProjectMemberDTO dto) {
        if (dto == null) return null;

        ProjectMember entity = new ProjectMember();

        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        // Only shallow fields
        entity.setRole(dto.getRole());
        entity.setHourlyRate(dto.getHourlyRate());
        entity.setActiveMember(dto.getActiveMember());
        entity.setJoinedAt(dto.getJoinedAt());
        entity.setLastActivity(dto.getLastActivity());

        return entity;
    }

    // ------------------------------------------------------------
    // UPDATE EXISTING ENTITY (used for PUT/PATCH)
    // ------------------------------------------------------------

    public static void updateEntity(ProjectMember entity, ProjectMemberDTO dto) {
        if (entity == null || dto == null) return;

        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setUpdatedBy(dto.getUpdatedBy());

        // Relations
        if (dto.getProjectId() != null) {
            Project p = new Project();
            p.setId(dto.getProjectId());
            entity.setProject(p);
        }

        if (dto.getUserId() != null) {
        	Employee u = new Employee();
            u.setId(dto.getId());
            entity.setEmployee(u);
        }

        // Member data
        entity.setRole(dto.getRole());
        entity.setHourlyRate(dto.getHourlyRate());
        entity.setActiveMember(dto.getActiveMember());
        entity.setJoinedAt(dto.getJoinedAt());
        entity.setLastActivity(dto.getLastActivity());
    }
    
    
}
