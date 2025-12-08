package com.dev.core.service.leave.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.mapper.leave.LeaveBalanceMapper;
import com.dev.core.model.leave.LeaveBalanceDTO;
import com.dev.core.model.leave.MinimalLeaveBalanceDTO;
import com.dev.core.repository.leave.LeaveBalanceRepository;
import com.dev.core.service.leave.LeaveBalanceService;
import com.dev.core.service.validation.leave.LeaveBalanceValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveBalanceServiceImpl implements LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveBalanceValidator validator;

    @Override
    public LeaveBalanceDTO getBalance(Long employeeId, Long leaveTypeId, Integer year) {
        return leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(employeeId, leaveTypeId, year)
                .map(LeaveBalanceMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<LeaveBalanceDTO> getAllBalances(Long employeeId, Integer year) {
        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                .stream().map(LeaveBalanceMapper::toDTO).toList();
    }

    @Override
    public List<MinimalLeaveBalanceDTO> getMinimalBalances(Long employeeId, Integer year) {
        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                .stream().map(LeaveBalanceMapper::toMinimalDTO).toList();
    }

    @Override
    public void initializeYearlyBalance(Long employeeId, Integer year) {
        // Call validator using a constructed DTO
        LeaveBalanceDTO dto = LeaveBalanceDTO.builder()
                .employeeId(employeeId)
                .year(year)
                .build();

        validator.validateBeforeInitialize(dto);
    }

    @Override
    public void accrueMonthlyEarnedLeaves(Integer year, Integer month) {
        // Example logic — actual earning rules can be appended
        LocalDate now = LocalDate.now();
    }

    @Override
    public void carryForwardBalances(Integer year) {
        // Future-proof placeholder; implement logic as needed
    }
}
