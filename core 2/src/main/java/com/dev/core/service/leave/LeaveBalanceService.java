package com.dev.core.service.leave;


import java.util.List;

import com.dev.core.model.leave.LeaveBalanceDTO;
import com.dev.core.model.leave.MinimalLeaveBalanceDTO;

public interface LeaveBalanceService {

    LeaveBalanceDTO getBalance(Long employeeId, Long leaveTypeId, Integer year);

    List<LeaveBalanceDTO> getAllBalances(Long employeeId, Integer year);

    List<MinimalLeaveBalanceDTO> getMinimalBalances(Long employeeId, Integer year);

    void initializeYearlyBalance(Long employeeId, Integer year);

    void accrueMonthlyEarnedLeaves(Integer year, Integer month);

    void carryForwardBalances(Integer year);
}
