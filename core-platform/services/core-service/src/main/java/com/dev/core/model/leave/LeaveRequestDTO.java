package com.dev.core.model.leave;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.dev.core.constants.LeaveStatus;
import com.dev.core.model.BaseDTO;
import com.dev.core.model.MinimalEmployeeDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO extends BaseDTO {

    private Long employeeId;
    private MinimalEmployeeDTO employee;

    private Long leaveTypeId;
    private LeaveTypeDTO leaveType;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double totalDays;

    private LeaveStatus status;

    private String reason;

    private Long managerId;
    private MinimalEmployeeDTO manager;

    private String managerComment;

    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
}
