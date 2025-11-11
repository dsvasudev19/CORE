package com.dev.core.mapper;

import com.dev.core.domain.EmployeeDocument;
import com.dev.core.model.EmployeeDocumentDTO;

public final class EmployeeDocumentMapper {

    private EmployeeDocumentMapper() {}

    public static EmployeeDocument toEntity(EmployeeDocumentDTO dto) {
        if (dto == null) return null;
        EmployeeDocument entity = new EmployeeDocument();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setDocumentName(dto.getDocumentName());
        entity.setDocumentType(dto.getDocumentType());
        entity.setFilePath(dto.getFilePath());
        entity.setVerified(dto.isVerified());
        return entity;
    }

    public static EmployeeDocumentDTO toDTO(EmployeeDocument entity) {
        if (entity == null) return null;
        return EmployeeDocumentDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .documentName(entity.getDocumentName())
                .documentType(entity.getDocumentType())
                .filePath(entity.getFilePath())
                .verified(entity.isVerified())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .employee(EmployeeMapper.toDTO(entity.getEmployee()))
                .build();
    }
}
