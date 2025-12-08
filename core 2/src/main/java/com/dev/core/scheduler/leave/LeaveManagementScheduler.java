package com.dev.core.scheduler.leave;


import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.leave.LeaveBalance;
import com.dev.core.domain.leave.LeaveType;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.leave.LeaveBalanceRepository;
import com.dev.core.repository.leave.LeaveTypeRepository;
import com.dev.core.service.NotificationService;

import lombok.RequiredArgsConstructor;

/**
 * Scheduler for:
 *  - monthly earned leave accrual (1st of month 02:00)
 *  - yearly carry-forward (Jan 1 03:00)
 *
 * IMPORTANT:
 *  - If your app is multi-tenant, replace `findByOrganizationIdAndActiveTrue(null)` with per-organization calls.
 *  - For large user bases, paginate when iterating employees/balances to avoid OOM.
 */
@Component
@RequiredArgsConstructor
public class LeaveManagementScheduler {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 2 1 * *") // 02:00 on 1st day of every month
    @Transactional
    public void accrueMonthly() {
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();
        log.info("LeaveManagementScheduler: monthly accrual start for {}/{}", month, year);

        // NOTE: adapt tenant logic as needed
        List<LeaveType> earnedTypes = leaveTypeRepository.findByOrganizationIdAndActiveTrue(null)
                .stream().filter(LeaveType::getEarnedLeave).toList();

        for (LeaveType type : earnedTypes) {
            Integer annual = type.getAnnualLimit();
            if (annual == null || annual <= 0) continue;

            int base = annual / 12;
            int remainder = annual % 12;
            int monthlyAdd = base + (month <= remainder ? 1 : 0);

            List<LeaveBalance> balances = leaveBalanceRepository.findByLeaveTypeIdAndYear(type.getId(), year);
            for (LeaveBalance bal : balances) {
                int newEarned = (bal.getEarned() == null ? 0 : bal.getEarned()) + monthlyAdd;
                bal.setEarned(newEarned);

                int opening = bal.getOpeningBalance() == null ? 0 : bal.getOpeningBalance();
                int used = bal.getUsed() == null ? 0 : bal.getUsed();
                bal.setClosingBalance(opening + newEarned - used);

                leaveBalanceRepository.save(bal);

                // optional: notify employee
                try {
                    if (bal.getEmployee() != null && bal.getEmployee().getEmail() != null) {
                        String subj = "Monthly Leave Accrual: " + type.getName();
                        String body = String.format("Dear %s,\n\n%s leave credited: %d. Closing balance: %d.\n\nRegards",
                                bal.getEmployee().getFullName(), type.getName(), monthlyAdd, bal.getClosingBalance());
                        notificationService.sendEmail(bal.getEmployee().getEmail(), subj, body);
                    }
                } catch (Exception ex) {
                    log.warn("accureMonthly: notify failed for empId={} reason={}", bal.getEmployee() != null ? bal.getEmployee().getId() : "n/a", ex.getMessage());
                    notificationService.handleNotificationFailure(bal.getEmployee() != null ? bal.getEmployee().getEmail() : "unknown", "accrual", ex);
                }
            }
        }

        log.info("LeaveManagementScheduler: monthly accrual completed for {}/{}", month, year);
    }

    @Scheduled(cron = "0 0 3 1 1 *") // 03:00 Jan 1st
    @Transactional
    public void carryForward() {
        LocalDate today = LocalDate.now();
        int prevYear = today.getYear() - 1;
        int nextYear = today.getYear();

        log.info("LeaveManagementScheduler: carry-forward start from year {}", prevYear);

        List<LeaveType> cfTypes = leaveTypeRepository.findByOrganizationIdAndActiveTrue(null)
                .stream().filter(t -> Boolean.TRUE.equals(t.getCarryForward())).toList();

        for (LeaveType t : cfTypes) {
            List<LeaveBalance> prevBalances = leaveBalanceRepository.findByLeaveTypeIdAndYear(t.getId(), prevYear);
            for (LeaveBalance prev : prevBalances) {
                int closing = prev.getClosingBalance() == null ? 0 : prev.getClosingBalance();
                int carry = Math.min(closing, t.getMaxCarryForward() == null ? 0 : t.getMaxCarryForward());

                Long empId = prev.getEmployee() != null ? prev.getEmployee().getId() : null;
                if (empId == null) continue;

                LeaveBalance next = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(empId, t.getId(), nextYear)
                        .orElseGet(() -> {
                            LeaveBalance nb = new LeaveBalance();
                            nb.setEmployee(prev.getEmployee());
                            nb.setLeaveType(prev.getLeaveType());
                            nb.setYear(nextYear);
                            nb.setOrganizationId(prev.getOrganizationId());
                            nb.setOpeningBalance(0);
                            nb.setEarned(0);
                            nb.setUsed(0);
                            nb.setClosingBalance(0);
                            return nb;
                        });

                next.setOpeningBalance(carry);
                int earned = next.getEarned() == null ? 0 : next.getEarned();
                int used = next.getUsed() == null ? 0 : next.getUsed();
                next.setClosingBalance(carry + earned - used);
                leaveBalanceRepository.save(next);

                // notify
                try {
                    if (prev.getEmployee() != null && prev.getEmployee().getEmail() != null) {
                        String subj = "Carry-forward applied: " + t.getName();
                        String body = String.format("Dear %s,\n\nCarry-forward of %d %s has been applied to your account for year %d.\n\nRegards",
                                prev.getEmployee().getFullName(), carry, t.getName(), nextYear);
                        notificationService.sendEmail(prev.getEmployee().getEmail(), subj, body);
                    }
                } catch (Exception ex) {
                    log.warn("carryForward: notify failed empId={} reason={}", prev.getEmployee() != null ? prev.getEmployee().getId() : "n/a", ex.getMessage());
                    notificationService.handleNotificationFailure(prev.getEmployee() != null ? prev.getEmployee().getEmail() : "unknown", "carry-forward", ex);
                }
            }
        }

        log.info("LeaveManagementScheduler: carry-forward completed.");
    }
}
