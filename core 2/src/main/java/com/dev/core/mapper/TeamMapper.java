package com.dev.core.mapper;

import com.dev.core.domain.Team;
import com.dev.core.model.TeamDTO;
import java.util.stream.Collectors;

public final class TeamMapper {

    private TeamMapper() {}

    public static Team toEntity(TeamDTO dto) {
        if (dto == null) return null;
        Team entity = new Team();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        return entity;
    }

    public static TeamDTO toDTO(Team entity) {
        if (entity == null) return null;
        return TeamDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .name(entity.getName())
                .description(entity.getDescription())
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getId() : null)
                .managerId(entity.getManager() != null ? entity.getManager().getId() : null)
                .department(DepartmentMapper.toDTO(entity.getDepartment()))
                .manager(EmployeeMapper.toDTO(entity.getManager()))
                .members(entity.getMembers() != null
                        ? entity.getMembers().stream()
                            .map(TeamMemberMapper::toDTO)
                            .collect(Collectors.toSet())
                        : null)
                .build();
    }
}

