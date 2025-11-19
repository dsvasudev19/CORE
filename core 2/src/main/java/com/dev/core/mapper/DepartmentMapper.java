package com.dev.core.mapper;

import com.dev.core.domain.Department;
import com.dev.core.model.DepartmentDTO;
import java.util.stream.Collectors;

public final class DepartmentMapper {

    private DepartmentMapper() {}

    public static Department toEntity(DepartmentDTO dto) {
        if (dto == null) return null;
        Department entity = new Department();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setCode(dto.getCode());
        return entity;
    }

    public static DepartmentDTO toDTO(Department entity) {
        if (entity == null) return null;
        return DepartmentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .name(entity.getName())
                .description(entity.getDescription())
                .employees(entity.getEmployees() != null
                        ? entity.getEmployees().stream()
                            .map(EmployeeMapper::toDTO)
                            .collect(Collectors.toSet())
                        : null)
                .teams(entity.getTeams() != null
                        ? entity.getTeams().stream()
                            .map(TeamMapper::toDTO)
                            .collect(Collectors.toSet())
                        : null)
                .code(entity.getCode())
                .build();
    }
}
