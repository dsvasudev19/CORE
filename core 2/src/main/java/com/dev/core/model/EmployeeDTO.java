package com.dev.core.model;

import com.dev.core.constants.EmployeeStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.Set;

@Data
@SuperBuilder
@Getter
@Setter
public class EmployeeDTO extends BaseDTO {

    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate joiningDate;
    private LocalDate exitDate;
    private EmployeeStatus status;

    // Relations (both IDs and full DTOs)
    private Long departmentId;
    private DepartmentDTO department;

    private Long designationId;
    private DesignationDTO designation;

    private Set<EmploymentHistoryDTO> histories;
    private Set<EmployeeDocumentDTO> documents;
    private Set<TeamMemberDTO> teamMemberships;
}
