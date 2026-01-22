package com.dev.core.mapper;

import com.dev.core.domain.EmployeeAsset;
import com.dev.core.model.EmployeeAssetDTO;

public final class EmployeeAssetMapper {

    private EmployeeAssetMapper() {}

    public static EmployeeAsset toEntity(EmployeeAssetDTO dto) {
        if (dto == null) return null;

        EmployeeAsset entity = new EmployeeAsset();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setAssetType(dto.getAssetType());
        entity.setAssigned(dto.getAssigned());

        // Only setting employeeId reference (shallow)
  

        return entity;
    }

    public static EmployeeAssetDTO toDTO(EmployeeAsset entity) {
        if (entity == null) return null;

        return EmployeeAssetDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .assetType(entity.getAssetType())
                .assigned(entity.getAssigned())
                .build();
    }
}
