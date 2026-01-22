package com.dev.core.mapper;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.dev.core.domain.Department;
import com.dev.core.domain.Team;
import com.dev.core.model.DepartmentDTO;

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

                .code(entity.getCode())
                .build();
    }
    
    public static DepartmentDTO toShallowDTO(Department entity) {
        if (entity == null) return null;

        return DepartmentDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .organizationId(entity.getOrganizationId())
                .build();
    }

}
