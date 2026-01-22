package com.dev.core.service.performance.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.ReviewStatus;
import com.dev.core.constants.ReviewType;
import com.dev.core.domain.Employee;
import com.dev.core.domain.performance.PerformanceCycle;
import com.dev.core.domain.performance.PerformanceReviewRequest;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.performance.PerformanceCycleRepository;
import com.dev.core.repository.performance.PerformanceReviewRequestRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.NotificationService;
import com.dev.core.service.performance.PeerSelectionService;
import com.dev.core.service.performance.PerformanceReviewSchedulerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceReviewSchedulerServiceImpl implements PerformanceReviewSchedulerService {

    private final PerformanceCycleRepository cycleRepo;
    private final PerformanceReviewRequestRepository requestRepo;
    private final EmployeeRepository employeeRepo;
    private final PeerSelectionService peerSelectionService;
    private final NotificationService notificationService;
    private final SecurityContextUtil securityContextUtil;

    // how many peers per employee (configurable)
    private final int peerCount = 2;

    @Override
    public void generateQuarterlyRequests() {
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int quarter = ((now.getMonthValue() - 1) / 3) + 1;

        // We'll create cycles per organization: map organizationId -> cycle
        Map<Long, PerformanceCycle> cycleByOrg = new HashMap<>();

        // fetch all active employees; ensure repo method exists
        List<Employee> employees = employeeRepo.findByOrganizationId(securityContextUtil.getCurrentOrganizationId()); // adapt org filter if needed

        for (Employee emp : employees) {
            Long orgId = emp.getOrganizationId(); // may be null
            PerformanceCycle cycle = cycleByOrg.computeIfAbsent(orgId, k -> {
                return cycleRepo.findByYearAndQuarterAndOrganizationId(year, quarter, orgId)
                        .orElseGet(() -> {
                            PerformanceCycle pc = PerformanceCycle.builder()
                                    .year(year)
                                    .quarter(quarter)
                                    .active(true)
                                    .startedAt(LocalDateTime.now())
                                    .build();
                            return cycleRepo.save(pc);
                        });
            });

            // create manager request
            if (emp.getManager() != null) {
                boolean exists = requestRepo.existsByCycleIdAndReviewerIdAndEmployeeId(cycle.getId(), emp.getManager().getId(), emp.getId());
                if (!exists) {
                    PerformanceReviewRequest mgrReq = PerformanceReviewRequest.builder()
                            .cycle(cycle)
                            .reviewer(emp.getManager())
                            .employee(emp)
                            .type(ReviewType.MANAGER)
                            .status(ReviewStatus.PENDING)
                            .build();
                    requestRepo.save(mgrReq);
                    // notify manager
                    try {
                        String to = emp.getManager().getEmail();
                        if (to != null && !to.isBlank()) {
                            notificationService.sendEmail(to,
                                    "Quarterly Performance Review Assigned",
                                    "You have a new performance review to complete for " + emp.getFullName());
                        }
                    } catch (Exception ex) {
                        notificationService.handleNotificationFailure(emp.getManager().getEmail(), "perf-review-create", ex);
                    }
                }
            }

            // peer requests
            List<Employee> peers = peerSelectionService.selectPeers(emp, peerCount);
            for (Employee peer : peers) {
                boolean exists = requestRepo.existsByCycleIdAndReviewerIdAndEmployeeId(cycle.getId(), peer.getId(), emp.getId());
                if (!exists) {
                    PerformanceReviewRequest pReq = PerformanceReviewRequest.builder()
                            .cycle(cycle)
                            .reviewer(peer)
                            .employee(emp)
                            .type(ReviewType.PEER)
                            .status(ReviewStatus.PENDING)
                            .build();
                    requestRepo.save(pReq);
                    try {
                        String to = peer.getEmail();
                        if (to != null && !to.isBlank()) {
                            notificationService.sendEmail(to,
                                    "Peer Performance Review Requested",
                                    "Please submit a peer review for " + emp.getFullName() + " for Q" + quarter + " " + year);
                        }
                    } catch (Exception ex) {
                        notificationService.handleNotificationFailure(peer.getEmail(), "perf-review-create", ex);
                    }
                }
            }
        }
    }

    /** Convenience API to manually trigger from admin UI or tests */
    @Override
    public void triggerNow() {
        generateQuarterlyRequests();
    }
}
