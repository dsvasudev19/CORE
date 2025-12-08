package com.dev.core.service.leave.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.LeaveStatus;
import com.dev.core.domain.Employee;
import com.dev.core.domain.leave.LeaveBalance;
import com.dev.core.domain.leave.LeaveRequest;
import com.dev.core.domain.leave.LeaveType;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.leave.LeaveRequestMapper;
import com.dev.core.model.leave.LeaveRequestDTO;
import com.dev.core.model.leave.MinimalLeaveRequestDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.leave.LeaveBalanceRepository;
import com.dev.core.repository.leave.LeaveRequestRepository;
import com.dev.core.repository.leave.LeaveTypeRepository;
import com.dev.core.service.NotificationService;
import com.dev.core.service.leave.LeaveRequestService;
import com.dev.core.service.leave.LeaveRuleEngineService;
import com.dev.core.service.validation.leave.LeaveRequestValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestValidator validator;
    private final LeaveRuleEngineService ruleEngine;
    private final NotificationService notificationService;

    @Override
    public LeaveRequestDTO createRequest(LeaveRequestDTO dto) {

        // Basic validation
        validator.validateBeforeCreate(dto);

        Employee employee = employeeRepository.findById(dto.getEmployeeId()).orElseThrow();
        LeaveType leaveType = leaveTypeRepository.findById(dto.getLeaveTypeId()).orElseThrow();

        LeaveRequest entity = new LeaveRequest();
        entity.setEmployee(employee);
        entity.setLeaveType(leaveType);
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setTotalDays(dto.getTotalDays());
        entity.setStatus(LeaveStatus.PENDING);
        entity.setReason(dto.getReason());
        entity.setManager(employeeRepository.findById(dto.getManagerId()).orElse(null));

        // ---------------- RULE ENGINE VALIDATIONS ----------------
        ruleEngine.validateDateRange(entity);
        ruleEngine.checkOverlappingLeaves(employee, entity);
        ruleEngine.validateLeaveLimits(employee, leaveType, entity);
        ruleEngine.validateLeaveBalance(employee, leaveType, entity);

        // Save
        entity = leaveRequestRepository.save(entity);

        // ---------------- EMAIL: Employee Confirmation ----------------
        if (entity.getEmployee().getEmail() != null) {
            notificationService.sendEmail(
                entity.getEmployee().getEmail(),
                "Leave Request Submitted",
                "Your leave request (" + entity.getStartDate() + " to " +
                entity.getEndDate() + ") has been submitted."
            );
        }

        // ---------------- EMAIL: Manager Approval ----------------
        Employee manager = entity.getManager();
        if (manager != null && manager.getEmail() != null) {
            notificationService.sendEmail(
                manager.getEmail(),
                "New Leave Request Pending Approval",
                "Employee " + entity.getEmployee().getFullName() +
                " has submitted a leave request for your approval."
            );
        }

        return LeaveRequestMapper.toDTO(entity);
    }

    @Override
    public LeaveRequestDTO updateRequest(Long id, LeaveRequestDTO dto) {

        validator.validateBeforeUpdate(id);

        LeaveRequest entity = leaveRequestRepository.findById(id).orElseThrow();
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setTotalDays(dto.getTotalDays());
        entity.setReason(dto.getReason());

        // ---------------- RULE ENGINE VALIDATIONS ----------------
        Employee employee = entity.getEmployee();
        LeaveType leaveType = entity.getLeaveType();

        ruleEngine.validateDateRange(entity);
        ruleEngine.checkOverlappingLeaves(employee, entity);
        ruleEngine.validateLeaveLimits(employee, leaveType, entity);
        ruleEngine.validateLeaveBalance(employee, leaveType, entity);

        entity = leaveRequestRepository.save(entity);
        return LeaveRequestMapper.toDTO(entity);
    }

    @Override
    public LeaveRequestDTO getById(Long id) {
        return leaveRequestRepository.findById(id)
                .map(LeaveRequestMapper::toDTO).orElse(null);
    }

    @Override
    public List<LeaveRequestDTO> getEmployeeRequests(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId)
                .stream().map(LeaveRequestMapper::toDTO).toList();
    }

    @Override
    public List<MinimalLeaveRequestDTO> getEmployeeRequestsMinimal(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId)
                .stream().map(LeaveRequestMapper::toMinimalDTO).toList();
    }

    @Override
    public List<LeaveRequestDTO> getManagerPendingApprovals(Long managerId) {
        return leaveRequestRepository.findByManagerIdAndStatus(managerId, LeaveStatus.PENDING)
                .stream().map(LeaveRequestMapper::toDTO).toList();
    }

    @Override
    public LeaveRequestDTO approve(Long requestId, Long managerId, String comment) {

        // Basic validation
        validator.validateBeforeApproval(requestId, managerId);
        validator.validateManagerAuthorization(requestId, managerId);

        LeaveRequest entity = leaveRequestRepository.findById(requestId).orElseThrow();
        Employee employee = entity.getEmployee();
        LeaveType leaveType = entity.getLeaveType();

        // ---------------- RULE ENGINE VALIDATIONS ----------------
        ruleEngine.validateDateRange(entity);
        ruleEngine.validateLeaveBalance(employee, leaveType, entity);

        // -------------- DEDUCT BALANCE (Atomic) ----------------
        int year = entity.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(employee.getId(), leaveType.getId(), year)
                .orElseThrow(() -> new ValidationFailedException(
                    "error.leaveRequest.balance.notfound",
                    new Object[]{employee.getId(), leaveType.getId(), year}
                ));

        int requestedDays = entity.getTotalDays() != null ?
                (int) Math.round(entity.getTotalDays()) :
                ruleEngine.calculateWorkingDays(entity.getStartDate(), entity.getEndDate());

        int used = (balance.getUsed() == null ? 0 : balance.getUsed()) + requestedDays;
        balance.setUsed(used);

        int opening = balance.getOpeningBalance() == null ? 0 : balance.getOpeningBalance();
        int earned = balance.getEarned() == null ? 0 : balance.getEarned();
        balance.setClosingBalance(opening + earned - used);

        leaveBalanceRepository.save(balance);

        // ---------------- UPDATE REQUEST ----------------
        entity.setStatus(LeaveStatus.APPROVED);
        entity.setManagerComment(comment);
        entity.setApprovedAt(LocalDateTime.now());

        entity = leaveRequestRepository.save(entity);

        // ---------------- EMAIL: Notify Employee ----------------
        if (entity.getEmployee().getEmail() != null) {
            notificationService.sendEmail(
                entity.getEmployee().getEmail(),
                "Leave Request Approved",
                "Your leave request for " + entity.getStartDate() + " to " + entity.getEndDate()
                        + " has been approved by your manager."
            );
        }

        return LeaveRequestMapper.toDTO(entity);
    }

    @Override
    public LeaveRequestDTO reject(Long requestId, Long managerId, String comment) {

        // Basic validation
        validator.validateBeforeApproval(requestId, managerId);
        validator.validateManagerAuthorization(requestId, managerId);

        LeaveRequest entity = leaveRequestRepository.findById(requestId).orElseThrow();

        // ---------------- RULE ENGINE VALIDATIONS ----------------
        ruleEngine.validateDateRange(entity);

        entity.setStatus(LeaveStatus.REJECTED);
        entity.setManagerComment(comment);
        entity.setRejectedAt(LocalDateTime.now());

        entity = leaveRequestRepository.save(entity);

        // ---------------- EMAIL: Notify Employee ----------------
        if (entity.getEmployee().getEmail() != null) {
            notificationService.sendEmail(
                entity.getEmployee().getEmail(),
                "Leave Request Rejected",
                "Your leave request for " + entity.getStartDate() + " to " + entity.getEndDate() +
                " is rejected.\nReason: " + comment
            );
        }

        return LeaveRequestMapper.toDTO(entity);
    }

    @Override
    public LeaveRequestDTO cancel(Long requestId) {

        LeaveRequest entity = leaveRequestRepository.findById(requestId).orElseThrow();
        entity.setStatus(LeaveStatus.CANCELLED);

        leaveRequestRepository.save(entity);

        return LeaveRequestMapper.toDTO(entity);
    }
}
