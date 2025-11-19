package com.dev.core.mapper;

import com.dev.core.domain.Designation;
import com.dev.core.model.DesignationDTO;
import java.util.stream.Collectors;

public final class DesignationMapper {

    private DesignationMapper() {}

    public static Designation toEntity(DesignationDTO dto) {
        if (dto == null) return null;
        Designation entity = new Designation();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setCode(dto.getCode());
        return entity;
    }

    public static DesignationDTO toDTO(Designation entity) {
        if (entity == null) return null;
        return DesignationDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .code(entity.getCode())
                .employees(entity.getEmployees() != null
                        ? entity.getEmployees().stream()
                            .map(EmployeeMapper::toDTO)
                            .collect(Collectors.toSet())
                        : null)
                .build();
    }
}
