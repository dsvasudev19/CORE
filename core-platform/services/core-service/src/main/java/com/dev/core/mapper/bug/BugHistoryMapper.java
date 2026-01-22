package com.dev.core.mapper.bug;

import com.dev.core.domain.BugHistory;
import com.dev.core.domain.Employee;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.bug.BugHistoryDTO;

public class BugHistoryMapper {

    private BugHistoryMapper() {}

    // ----------------------------------------------------
    // TO DTO
    // ----------------------------------------------------
    public static BugHistoryDTO toDTO(BugHistory entity) {
        if (entity == null) return null;

        return BugHistoryDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .changedField(entity.getChangedField())
                .oldValue(entity.getOldValue())
                .newValue(entity.getNewValue())
                .changedBy(toMinimalEmployeeDTO(entity.getChangedBy()))
                .changedAt(entity.getChangedAt())
                .note(entity.getNote())
                .bugId(entity.getBug() != null ? entity.getBug().getId() : null)
                .build();
    }

    // ----------------------------------------------------
    // TO ENTITY
    // ----------------------------------------------------
    public static BugHistory toEntity(BugHistoryDTO dto) {
        if (dto == null) return null;

        BugHistory entity = new BugHistory();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setChangedField(dto.getChangedField());
        entity.setOldValue(dto.getOldValue());
        entity.setNewValue(dto.getNewValue());
        entity.setChangedBy(toEmployeeEntity(dto.getChangedBy()));

        entity.setChangedAt(dto.getChangedAt());
        entity.setNote(dto.getNote());
        return entity;
    }


    // ----------------------------------------------------
    // Helper: Employee -> MinimalEmployeeDTO
    // ----------------------------------------------------
    private static MinimalEmployeeDTO toMinimalEmployeeDTO(Employee emp) {
        if (emp == null) return null;
        return MinimalEmployeeDTO.builder()
                .id(emp.getId())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .email(emp.getEmail())
                .build();
    }

    // ----------------------------------------------------
    // Helper: MinimalEmployeeDTO -> Employee stub
    // ----------------------------------------------------
    private static Employee toEmployeeEntity(MinimalEmployeeDTO dto) {
        if (dto == null || dto.getId() == null) return null;

        Employee emp = new Employee();
        emp.setId(dto.getId());  // only set ID, avoid full fetch
        return emp;
    }
}
