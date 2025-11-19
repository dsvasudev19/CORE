package com.dev.core.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.dev.core.constants.EmployeeStatus;
import com.dev.core.constants.ProfileStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO extends BaseDTO {

    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate joiningDate;
    private LocalDate exitDate;
    private EmployeeStatus status;

    // ⭐ Profile Status
    private ProfileStatus profileStatus;

    // ⭐ Manager
    private Long managerId;
    private EmployeeDTO manager; // optional — you may remove if you don't want recursive structures

    // ⭐ Personal Details
    private LocalDate dob;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;

    // ⭐ Access Setup
    private String workEmail;
    private List<String> systemAccess;

    // ⭐ Orientation / Compliance
    private Boolean policyAcknowledgment;
    private Boolean ndaSigned;
    private Boolean securityTraining;
    private Boolean toolsTraining;

    // ⭐ Relations (IDs + DTOs)
    private Long departmentId;
    private DepartmentDTO department;

    private Long designationId;
    private DesignationDTO designation;

    private Long userId;

    // ⭐ Collections
    private Set<EmploymentHistoryDTO> histories;
    private Set<EmployeeDocumentDTO> documents;
    private Set<TeamMemberDTO> teamMemberships;
    private Set<EmployeeAssetDTO> assets;
}
