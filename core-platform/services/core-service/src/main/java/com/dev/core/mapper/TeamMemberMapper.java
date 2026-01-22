package com.dev.core.mapper;

import org.springframework.stereotype.Component;

import com.dev.core.domain.TeamMember;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.TeamMemberDTO;
import com.dev.core.service.EmployeeService;

import lombok.RequiredArgsConstructor;



@Component
@RequiredArgsConstructor
public final class TeamMemberMapper {
	
	
	private static EmployeeService employeeService;



    public static TeamMember toEntity(TeamMemberDTO dto) {
        if (dto == null) return null;
        TeamMember entity = new TeamMember();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setLead(dto.isLead());
        entity.setManager(dto.isManager());
        return entity;
    }

    public static TeamMemberDTO toDTO(TeamMember entity) {
    	EmployeeDTO emp=getEmployeeDetails(entity.getEmployee().getId());
        if (entity == null) return null;
        return TeamMemberDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .isLead(entity.isLead())
                .isManager(entity.isManager())
                .teamId(entity.getTeam() != null ? entity.getTeam().getId() : null)
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .team(TeamMapper.toDTO(entity.getTeam()))
                .employee(MinimalEmployeeDTO.builder().email(emp.getEmail())
                		.phone(emp.getPhone()).firstName(emp.getFirstName()).lastName(emp.getLastName()).employeeCode(emp.getEmployeeCode()).build())
                .build();
    }
    public static EmployeeDTO getEmployeeDetails(long employeeId) {
    	return employeeService.getEmployeeById(employeeId);
    }
}
