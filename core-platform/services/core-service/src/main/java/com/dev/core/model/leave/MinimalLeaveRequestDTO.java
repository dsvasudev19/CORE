package com.dev.core.model.leave;

import java.time.LocalDate;

import com.dev.core.constants.LeaveStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MinimalLeaveRequestDTO {

    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double totalDays;

    private LeaveStatus status;

    private Long leaveTypeId;
    private String leaveTypeName;
}
