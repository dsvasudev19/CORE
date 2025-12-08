package com.dev.core.controller.leave;

import com.dev.core.model.leave.LeaveBalanceDTO;
import com.dev.core.model.leave.MinimalLeaveBalanceDTO;
import com.dev.core.service.leave.LeaveBalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-balances")
@RequiredArgsConstructor
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    @GetMapping("/{employeeId}/{leaveTypeId}/{year}")
    public LeaveBalanceDTO getBalance(
            @PathVariable Long employeeId,
            @PathVariable Long leaveTypeId,
            @PathVariable Integer year
    ) {
        return leaveBalanceService.getBalance(employeeId, leaveTypeId, year);
    }

    @GetMapping("/{employeeId}/year/{year}")
    public List<LeaveBalanceDTO> getBalances(
            @PathVariable Long employeeId,
            @PathVariable Integer year
    ) {
        return leaveBalanceService.getAllBalances(employeeId, year);
    }

    @GetMapping("/minimal/{employeeId}/year/{year}")
    public List<MinimalLeaveBalanceDTO> getMinimalBalances(
            @PathVariable Long employeeId,
            @PathVariable Integer year
    ) {
        return leaveBalanceService.getMinimalBalances(employeeId, year);
    }

    @PostMapping("/initialize/{employeeId}/{year}")
    public void initialize(
            @PathVariable Long employeeId,
            @PathVariable Integer year
    ) {
        leaveBalanceService.initializeYearlyBalance(employeeId, year);
    }
}
