package com.dev.core.mapper;

import com.dev.core.domain.TeamMember;
import com.dev.core.model.TeamMemberDTO;

public final class TeamMemberMapper {

    private TeamMemberMapper() {}

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
        if (entity == null) return null;
        return TeamMemberDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .isLead(entity.isLead())
                .isManager(entity.isManager())
                .teamId(entity.getTeam() != null ? entity.getTeam().getId() : null)
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .team(TeamMapper.toDTO(entity.getTeam()))
                .employee(EmployeeMapper.toDTO(entity.getEmployee()))
                .build();
    }
}
