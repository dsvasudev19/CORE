package com.dev.core.mapper;

import com.dev.core.domain.*;
import com.dev.core.model.*;
import java.util.stream.Collectors;

public final class EmployeeMapper {

    private EmployeeMapper() {}

    // -------------------------------------------
    //                TO ENTITY
    // -------------------------------------------
    public static Employee toEntity(EmployeeDTO dto) {
        if (dto == null) return null;

        Employee entity = new Employee();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());

        entity.setEmployeeCode(dto.getEmployeeCode());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setJoiningDate(dto.getJoiningDate());
        entity.setExitDate(dto.getExitDate());
        entity.setStatus(dto.getStatus());

        // Profile status
        entity.setProfileStatus(dto.getProfileStatus());

        // Personal details
        entity.setDob(dto.getDob());
        entity.setAddress(dto.getAddress());
        entity.setEmergencyContact(dto.getEmergencyContact());
        entity.setEmergencyPhone(dto.getEmergencyPhone());

        // Access setup
        entity.setWorkEmail(dto.getWorkEmail());
        entity.setSystemAccess(dto.getSystemAccess());
        
        //Team
        entity.setDepartment(DepartmentMapper.toEntity(dto.getDepartment()));
        entity.setDesignation(DesignationMapper.toEntity(dto.getDesignation()));

        // Orientation
        entity.setPolicyAcknowledgment(dto.getPolicyAcknowledgment());
        entity.setNdaSigned(dto.getNdaSigned());
        entity.setSecurityTraining(dto.getSecurityTraining());
        entity.setToolsTraining(dto.getToolsTraining());
        
     // Manager handling (SAFEST APPROACH)
        if (dto.getManager().getId() != null) {
            Employee manager = new Employee();
            manager.setId(dto.getManager().getId()); // Reference only
            entity.setManager(manager);
        }
        
        

        
        return entity;
    }

    // -------------------------------------------
    //                  TO DTO
    // -------------------------------------------
    public static EmployeeDTO toDTO(Employee entity) {
        if (entity == null) return null;

        return EmployeeDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())

                .employeeCode(entity.getEmployeeCode())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .joiningDate(entity.getJoiningDate())
                .exitDate(entity.getExitDate())
                .status(entity.getStatus())

                // Profile Status
                .profileStatus(entity.getProfileStatus())

                // Personal
                .dob(entity.getDob())
                .address(entity.getAddress())
                .emergencyContact(entity.getEmergencyContact())
                .emergencyPhone(entity.getEmergencyPhone())

                // Access setup
                .workEmail(entity.getWorkEmail())
                .systemAccess(entity.getSystemAccess())

                // Orientation
                .policyAcknowledgment(entity.getPolicyAcknowledgment())
                .ndaSigned(entity.getNdaSigned())
                .securityTraining(entity.getSecurityTraining())
                .toolsTraining(entity.getToolsTraining())

                // Manager
                .managerId(entity.getManager() != null ? entity.getManager().getId() : null)
                .manager(entity.getManager() != null 
                ? MinimalEmployeeDTO.builder()
                       .id(entity.getManager().getId())
                       .firstName(entity.getManager().getFirstName())
                       .lastName(entity.getManager().getLastName())
                       .build()
                : null)

                // Relations (IDs and DTOs)
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getId() : null)
                .designationId(entity.getDesignation() != null ? entity.getDesignation().getId() : null)


                // History
                .histories(entity.getHistories() != null
                        ? entity.getHistories().stream()
                        .map(EmploymentHistoryMapper::toDTO)
                        .collect(Collectors.toSet())
                        : null)

                // Documents
                .documents(entity.getDocuments() != null
                        ? entity.getDocuments().stream()
                        .map(EmployeeDocumentMapper::toDTO)
                        .collect(Collectors.toSet())
                        : null)

                // Team members
                .teamMemberships(entity.getTeamMemberships() != null
                        ? entity.getTeamMemberships().stream()
                        .map(TeamMemberMapper::toDTO)
                        .collect(Collectors.toSet())
                        : null)

                // Assets
                .assets(entity.getAssets() != null
                        ? entity.getAssets().stream()
                        .map(EmployeeAssetMapper::toDTO)
                        .collect(Collectors.toSet())
                        : null)
                .department(DepartmentMapper.toShallowDTO(entity.getDepartment()))
                .designation(DesignationMapper.toShallowDTO(entity.getDesignation()))

                .build();
    }
}

