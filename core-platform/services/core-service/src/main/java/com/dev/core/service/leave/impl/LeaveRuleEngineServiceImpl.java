package com.dev.core.service.leave.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.dev.core.constants.LeaveStatus;
import com.dev.core.domain.Employee;
import com.dev.core.domain.leave.LeaveBalance;
import com.dev.core.domain.leave.LeaveRequest;
import com.dev.core.domain.leave.LeaveType;
import com.dev.core.exception.UnauthorizedAccessException;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.leave.LeaveBalanceRepository;
import com.dev.core.repository.leave.LeaveRequestRepository;
import com.dev.core.repository.leave.LeaveTypeRepository;
import com.dev.core.service.leave.LeaveRuleEngineService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LeaveRuleEngineServiceImpl implements LeaveRuleEngineService {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;

    private static final Set<LeaveStatus> OVERLAP_STATUSES = Set.of(LeaveStatus.PENDING, LeaveStatus.APPROVED);

    @Override
    public void validateDateRange(LeaveRequest request) {
        if (request == null)
            throw new ValidationFailedException("error.leaveRequest.null", null);

        if (request.getStartDate() == null)
            throw new ValidationFailedException("error.leaveRequest.startdate.required", null);

        if (request.getEndDate() == null)
            throw new ValidationFailedException("error.leaveRequest.enddate.required", null);

        if (request.getEndDate().isBefore(request.getStartDate()))
            throw new ValidationFailedException("error.leaveRequest.date.invalid", null);

        // optional: verify totalDays matches computed working days (tolerance 0.5)
        if (request.getTotalDays() != null) {
            int computed = calculateWorkingDays(request.getStartDate(), request.getEndDate());
            double provided = request.getTotalDays();
            if (Math.abs(provided - computed) > 0.5) {
                log.debug("validateDateRange: provided totalDays={} computed={}", provided, computed);
                // do not fail here strictly; optionally warn or fail depending on your policy
            }
        }
    }

    @Override
    public void validateLeaveLimits(Employee employee, LeaveType leaveType, LeaveRequest request) {
        if (employee == null) throw new ValidationFailedException("error.employee.null", null);
        if (leaveType == null) throw new ValidationFailedException("error.leaveType.null", null);
        if (request == null) throw new ValidationFailedException("error.leaveRequest.null", null);

        Long empId = employee.getId();
        Long typeId = leaveType.getId();
        LocalDate start = request.getStartDate();
        LocalDate end = request.getEndDate();

        int requestedDays = request.getTotalDays() != null ? (int) Math.round(request.getTotalDays()) :
                calculateWorkingDays(start, end);

        int year = start.getYear();
        int month = start.getMonthValue();
        int quarter = ((month - 1) / 3) + 1;

        // MONTHLY
        if (leaveType.getMonthlyLimit() != null) {
            LocalDate monthStart = LocalDate.of(year, month, 1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            int usedThisMonth = leaveRequestRepository.findByEmployeeIdAndStartDateBetween(empId, monthStart, monthEnd)
                    .stream()
                    .filter(r -> r.getStatus() != null && r.getStatus() != LeaveStatus.REJECTED
                            && r.getLeaveType() != null && typeId.equals(r.getLeaveType().getId()))
                    .mapToInt(r -> r.getTotalDays() != null ? (int)Math.round(r.getTotalDays())
                            : calculateWorkingDays(r.getStartDate(), r.getEndDate()))
                    .sum();

            if ((usedThisMonth + requestedDays) > leaveType.getMonthlyLimit()) {
                throw new ValidationFailedException("error.leaveRequest.monthly.limit.exceeded",
                        new Object[]{leaveType.getMonthlyLimit(), usedThisMonth, requestedDays});
            }
        }

        // QUARTERLY
        if (leaveType.getQuarterlyLimit() != null) {
            LocalDate qStart = LocalDate.of(year, (quarter - 1) * 3 + 1, 1);
            LocalDate qEnd = qStart.plusMonths(2).withDayOfMonth(qStart.plusMonths(2).lengthOfMonth());
            int usedThisQuarter = leaveRequestRepository.findByEmployeeIdAndStartDateBetween(empId, qStart, qEnd)
                    .stream()
                    .filter(r -> r.getStatus() != null && r.getStatus() != LeaveStatus.REJECTED
                            && r.getLeaveType() != null && typeId.equals(r.getLeaveType().getId()))
                    .mapToInt(r -> r.getTotalDays() != null ? (int)Math.round(r.getTotalDays())
                            : calculateWorkingDays(r.getStartDate(), r.getEndDate()))
                    .sum();

            if ((usedThisQuarter + requestedDays) > leaveType.getQuarterlyLimit()) {
                throw new ValidationFailedException("error.leaveRequest.quarterly.limit.exceeded",
                        new Object[]{leaveType.getQuarterlyLimit(), usedThisQuarter, requestedDays});
            }
        }

        // ANNUAL
        if (leaveType.getAnnualLimit() != null) {
            LocalDate yearStart = LocalDate.of(year, 1, 1);
            LocalDate yearEnd = LocalDate.of(year, 12, 31);
            int usedThisYear = leaveRequestRepository.findByEmployeeIdAndStartDateBetween(empId, yearStart, yearEnd)
                    .stream()
                    .filter(r -> r.getStatus() != null && r.getStatus() != LeaveStatus.REJECTED
                            && r.getLeaveType() != null && typeId.equals(r.getLeaveType().getId()))
                    .mapToInt(r -> r.getTotalDays() != null ? (int)Math.round(r.getTotalDays())
                            : calculateWorkingDays(r.getStartDate(), r.getEndDate()))
                    .sum();

            if ((usedThisYear + requestedDays) > leaveType.getAnnualLimit()) {
                throw new ValidationFailedException("error.leaveRequest.annual.limit.exceeded",
                        new Object[]{leaveType.getAnnualLimit(), usedThisYear, requestedDays});
            }
        }
    }

    @Override
    public void validateLeaveBalance(Employee employee, LeaveType leaveType, LeaveRequest request) {
        if (employee == null) throw new ValidationFailedException("error.employee.null", null);
        if (leaveType == null) throw new ValidationFailedException("error.leaveType.null", null);
        if (request == null) throw new ValidationFailedException("error.leaveRequest.null", null);

        int year = request.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(employee.getId(), leaveType.getId(), year)
                .orElseThrow(() -> new ValidationFailedException("error.leaveRequest.balance.notfound",
                        new Object[]{employee.getId(), leaveType.getId(), year}));

        int opening = balance.getOpeningBalance() == null ? 0 : balance.getOpeningBalance();
        int earned = balance.getEarned() == null ? 0 : balance.getEarned();
        int used = balance.getUsed() == null ? 0 : balance.getUsed();

        int available = opening + earned - used;
        int requestedDays = request.getTotalDays() != null ? (int) Math.round(request.getTotalDays()) :
                calculateWorkingDays(request.getStartDate(), request.getEndDate());

        if (available < requestedDays) {
            throw new ValidationFailedException("error.leaveRequest.insufficient.balance",
                    new Object[]{available, requestedDays});
        }
    }

    @Override
    public void checkOverlappingLeaves(Employee employee, LeaveRequest request) {
        if (employee == null) throw new ValidationFailedException("error.employee.null", null);
        if (request == null) throw new ValidationFailedException("error.leaveRequest.null", null);

        Long empId = employee.getId();
        LocalDate start = request.getStartDate();
        LocalDate end = request.getEndDate();

        List<LeaveRequest> overlaps = leaveRequestRepository
                .findByEmployeeIdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        empId, List.copyOf(OVERLAP_STATUSES), end, start
                );

        if (overlaps != null && !overlaps.isEmpty()) {
            // If updating an existing request, allow overlap only with itself
            boolean onlySelf = overlaps.size() == 1 && overlaps.get(0).getId() != null && overlaps.get(0).getId().equals(request.getId());
            if (!onlySelf) {
                throw new ValidationFailedException("error.leaveRequest.overlap", new Object[]{overlaps.size()});
            }
        }
    }

    @Override
    public void checkManagerApproval(Employee employee, Long managerId) {
        if (employee == null) throw new ValidationFailedException("error.employee.null", null);
        if (managerId == null) throw new ValidationFailedException("error.leaveRequest.manager.required", null);

        if (employee.getManager() == null) {
            throw new UnauthorizedAccessException("This employee has no assigned manager.");
        }

        Long actualManagerId = employee.getManager().getId();
        if (!actualManagerId.equals(managerId)) {
            throw new UnauthorizedAccessException("You are not authorized to approve this leave request.");
        }
    }

    // ---------- helper ----------
    public int calculateWorkingDays(LocalDate start, LocalDate end) {
        if (start == null || end == null) return 0;
        if (end.isBefore(start)) return 0;
        int days = 0;
        LocalDate d = start;
        while (!d.isAfter(end)) {
            DayOfWeek dow = d.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) days++;
            d = d.plusDays(1);
        }
        return days;
    }
}
