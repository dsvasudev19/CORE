package com.dev.core.service.leave;


import java.time.LocalDate;

import com.dev.core.domain.Employee;
import com.dev.core.domain.leave.LeaveRequest;
import com.dev.core.domain.leave.LeaveType;

public interface LeaveRuleEngineService {

    void validateDateRange(LeaveRequest request);

    void validateLeaveLimits(Employee employee, LeaveType leaveType, LeaveRequest request);

    void validateLeaveBalance(Employee employee, LeaveType leaveType, LeaveRequest request);

    void checkOverlappingLeaves(Employee employee, LeaveRequest request);

    void checkManagerApproval(Employee employee, Long managerId);
    
    int calculateWorkingDays(LocalDate start, LocalDate end);

}

