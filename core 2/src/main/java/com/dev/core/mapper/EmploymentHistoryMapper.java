package com.dev.core.mapper;

import com.dev.core.domain.EmploymentHistory;
import com.dev.core.model.EmploymentHistoryDTO;

public final class EmploymentHistoryMapper {

    private EmploymentHistoryMapper() {}

    public static EmploymentHistory toEntity(EmploymentHistoryDTO dto) {
        if (dto == null) return null;
        EmploymentHistory entity = new EmploymentHistory();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setPreviousDepartment(dto.getPreviousDepartment());
        entity.setPreviousDesignation(dto.getPreviousDesignation());
        entity.setNewDepartment(dto.getNewDepartment());
        entity.setNewDesignation(dto.getNewDesignation());
        entity.setEffectiveDate(dto.getEffectiveDate());
        entity.setRemarks(dto.getRemarks());
        return entity;
    }

    public static EmploymentHistoryDTO toDTO(EmploymentHistory entity) {
        if (entity == null) return null;
        return EmploymentHistoryDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .previousDepartment(entity.getPreviousDepartment())
                .previousDesignation(entity.getPreviousDesignation())
                .newDepartment(entity.getNewDepartment())
                .newDesignation(entity.getNewDesignation())
                .effectiveDate(entity.getEffectiveDate())
                .remarks(entity.getRemarks())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .employee(EmployeeMapper.toDTO(entity.getEmployee()))
                .build();
    }
}
