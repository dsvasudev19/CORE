package com.dev.core.model.leave;

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
public class LeaveBalanceDTO extends BaseDTO {

    private Long employeeId;
    private MinimalEmployeeDTO employee;

    private Long leaveTypeId;
    private LeaveTypeDTO leaveType;

    private Integer year;

    private Integer openingBalance;
    private Integer earned;
    private Integer used;
    private Integer closingBalance;
}
