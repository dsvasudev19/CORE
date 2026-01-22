package com.dev.core.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@Getter
@Setter
public class EmploymentHistoryDTO extends BaseDTO {

    private Long employeeId;
    private EmployeeDTO employee;

    private String previousDepartment;
    private String previousDesignation;
    private String newDepartment;
    private String newDesignation;

    private LocalDate effectiveDate;
    private String remarks;
}
