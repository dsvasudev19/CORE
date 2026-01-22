package com.dev.core.service.impl.bug;

import com.dev.core.constants.BugSeverity;
import com.dev.core.domain.Bug;
import com.dev.core.domain.Employee;
import com.dev.core.exception.BaseException;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.bug.BugRepository;
import com.dev.core.service.EmployeeService;
import com.dev.core.service.NotificationService;
import com.dev.core.service.UserService;
import com.dev.core.service.bug.BugAutomationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BugAutomationServiceImpl implements BugAutomationService {

    private final BugRepository bugRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final TaskScheduler taskScheduler;
    private final EmployeeService employeeService;

    // --------------------------------------------------------------
    // onBugReported
    // --------------------------------------------------------------
    @Override
    public void onBugReported(Long bugId) {
        Bug bug = getBug(bugId);
        log.info("🐞 Bug [{}] reported - notifying reporter and assignee if any", bugId);

        String reporterEmail = getUserEmailFromEmployee(bug.getReportedBy());
        String assigneeEmail = getUserEmailFromEmployee(bug.getAssignedTo());

        notificationService.sendEmail(
                List.of(reporterEmail, assigneeEmail),
                "🐞 New Bug Reported: " + bug.getTitle(),
                """
                A new bug has been reported.

                Project: %s
                Title: %s
                Severity: %s
                Status: %s
                Description: %s
                """.formatted(
                        bug.getProject() != null ? bug.getProject().getName() : "N/A",
                        bug.getTitle(),
                        bug.getSeverity(),
                        bug.getStatus(),
                        bug.getDescription() != null ? bug.getDescription() : "No description provided."
                )
        );

        scheduleDueReminders(bug);
    }

    // --------------------------------------------------------------
    // onBugAssigned
    // --------------------------------------------------------------
    @Override
    public void onBugAssigned(Long bugId, Long assigneeId) {
        Bug bug = getBug(bugId);
        String assigneeEmail = getUserEmail(assigneeId);

        if (assigneeEmail != null) {
            notificationService.sendEmail(
                    assigneeEmail,
                    "📬 Bug Assigned: " + bug.getTitle(),
                    """
                    You have been assigned a new bug.

                    Project: %s
                    Title: %s
                    Severity: %s
                    Due Date: %s
                    """.formatted(
                            bug.getProject() != null ? bug.getProject().getName() : "N/A",
                            bug.getTitle(),
                            bug.getSeverity(),
                            bug.getDueDate() != null ? bug.getDueDate() : "Not set"
                    )
            );
        }

        log.info("📬 Bug [{}] assigned to user [{}]", bugId, assigneeId);
    }

    // --------------------------------------------------------------
    // onBugStatusChanged
    // --------------------------------------------------------------
    @Override
    public void onBugStatusChanged(Long bugId, String oldStatus, String newStatus) {
        Bug bug = getBug(bugId);
        String reporterEmail = getUserEmailFromEmployee(bug.getReportedBy());
        String assigneeEmail = getUserEmailFromEmployee(bug.getAssignedTo());
        String verifierEmail = getUserEmailFromEmployee(bug.getVerifiedBy());

        notificationService.sendEmail(
                List.of(reporterEmail, assigneeEmail),
                "🔄 Bug Status Changed: " + bug.getTitle(),
                """
                Bug status changed from %s → %s

                Project: %s
                Title: %s
                Severity: %s
                Description: %s
                """.formatted(
                        oldStatus,
                        newStatus,
                        bug.getProject() != null ? bug.getProject().getName() : "N/A",
                        bug.getTitle(),
                        bug.getSeverity(),
                        bug.getDescription() != null ? bug.getDescription() : "No description provided."
                )
        );

        log.info("🔄 Bug [{}] status changed from {} → {}", bugId, oldStatus, newStatus);
    }

    // --------------------------------------------------------------
    // onBugSeverityChanged
    // --------------------------------------------------------------
    @Override
    public void onBugSeverityChanged(Long bugId, String oldSeverity, String newSeverity) {
        Bug bug = getBug(bugId);
        log.info("⚠️ Bug [{}] severity changed from {} → {}", bugId, oldSeverity, newSeverity);

        // If severity becomes CRITICAL → notify reporter + assignee immediately
        if (BugSeverity.valueOf(newSeverity) == BugSeverity.CRITICAL) {
            String reporterEmail = getUserEmailFromEmployee(bug.getReportedBy());
            String assigneeEmail = getUserEmailFromEmployee(bug.getAssignedTo());

            notificationService.sendEmail(
                    List.of(reporterEmail, assigneeEmail),
                    "🚨 Critical Bug Detected: " + bug.getTitle(),
                    """
                    A bug has been marked as CRITICAL.

                    Project: %s
                    Title: %s
                    Description: %s
                    Please prioritize its resolution immediately.
                    """.formatted(
                            bug.getProject() != null ? bug.getProject().getName() : "N/A",
                            bug.getTitle(),
                            bug.getDescription() != null ? bug.getDescription() : "No description provided."
                    )
            );
        }
    }

    // --------------------------------------------------------------
    // onBugResolved
    // --------------------------------------------------------------
    @Override
    public void onBugResolved(Long bugId) {
        Bug bug = getBug(bugId);
        String reporterEmail = getUserEmailFromEmployee(bug.getReportedBy());
        String verifierEmail = getUserEmailFromEmployee(bug.getVerifiedBy());

        notificationService.sendEmail(
                List.of(reporterEmail),
                "✅ Bug Resolved: " + bug.getTitle(),
                """
                The bug has been marked as resolved and awaits verification.

                Project: %s
                Title: %s
                Severity: %s
                Resolved At: %s
                """.formatted(
                        bug.getProject() != null ? bug.getProject().getName() : "N/A",
                        bug.getTitle(),
                        bug.getSeverity(),
                        bug.getResolvedAt() != null ? bug.getResolvedAt() : LocalDateTime.now()
                )
        );

        log.info("✅ Bug [{}] resolved notification sent", bugId);
    }

    // --------------------------------------------------------------
    // onBugClosed
    // --------------------------------------------------------------
    @Override
    public void onBugClosed(Long bugId) {
        Bug bug = getBug(bugId);
        String reporterEmail = getUserEmailFromEmployee(bug.getReportedBy());

        notificationService.sendEmail(
                reporterEmail,
                "📁 Bug Closed: " + bug.getTitle(),
                """
                The bug has been verified and closed successfully.

                Project: %s
                Closed At: %s
                """.formatted(
                        bug.getProject() != null ? bug.getProject().getName() : "N/A",
                        bug.getClosedAt() != null ? bug.getClosedAt() : LocalDateTime.now()
                )
        );

        log.info("📁 Bug [{}] closed", bugId);
    }

    // --------------------------------------------------------------
    // onBugReopened
    // --------------------------------------------------------------
    @Override
    public void onBugReopened(Long bugId) {
        Bug bug = getBug(bugId);
        String assigneeEmail = getUserEmailFromEmployee(bug.getAssignedTo());

        notificationService.sendEmail(
                assigneeEmail,
                "🔁 Bug Reopened: " + bug.getTitle(),
                """
                The bug was reopened for further investigation.

                Project: %s
                Current Status: %s
                Reopen Count: %s
                """.formatted(
                        bug.getProject() != null ? bug.getProject().getName() : "N/A",
                        bug.getStatus(),
                        bug.getReopenCount()
                )
        );

        log.info("🔁 Bug [{}] reopened", bugId);
    }

    // --------------------------------------------------------------
    // onBugDueSoon
    // --------------------------------------------------------------
    @Override
    public void onBugDueSoon(Long bugId) {
        Bug bug = getBug(bugId);
        String assigneeEmail = getUserEmailFromEmployee(bug.getAssignedTo());

        notificationService.sendEmail(
                assigneeEmail,
                "⏰ Bug Due Soon: " + bug.getTitle(),
                """
                Reminder: This bug is due on %s.

                Please ensure resolution before the deadline.
                """.formatted(bug.getDueDate())
        );

        log.info("⏰ Bug [{}] due soon notification sent", bugId);
    }

    // --------------------------------------------------------------
    // onBugOverdue
    // --------------------------------------------------------------
    @Override
    public void onBugOverdue(Long bugId) {
        Bug bug = getBug(bugId);
        String assigneeEmail = getUserEmailFromEmployee(bug.getAssignedTo());
        String reporterEmail = getUserEmailFromEmployee(bug.getReportedBy());

        notificationService.sendEmail(
                List.of(assigneeEmail, reporterEmail),
                "🚨 Overdue Bug: " + bug.getTitle(),
                """
                The bug is overdue and requires immediate attention.

                Project: %s
                Severity: %s
                Due Date: %s
                """.formatted(
                        bug.getProject() != null ? bug.getProject().getName() : "N/A",
                        bug.getSeverity(),
                        bug.getDueDate()
                )
        );

        log.info("🚨 Bug [{}] overdue notification sent", bugId);
    }

    // --------------------------------------------------------------
    // Helper: Fetch Bug Entity
    // --------------------------------------------------------------
    private Bug getBug(Long bugId) {
        return bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));
    }

    // --------------------------------------------------------------
    // Helper: Get User Email from UserService (by ID)
    // --------------------------------------------------------------
    private String getUserEmail(Long userId) {
        if (userId == null) return null;

        // 1️⃣ Try userService first
        try {
            UserDTO user = userService.getUserById(userId);
            if (user != null && user.getEmail() != null) {
                return user.getEmail();
            }
        } catch (Exception e) {
            log.debug("User lookup failed for userId {}: {}", userId, e.getMessage());
        }

        // 2️⃣ Fallback to employeeService
        try {
            EmployeeDTO emp = employeeService.getEmployeeById(userId);
            if (emp != null && emp.getEmail() != null) {
                return emp.getEmail();
            }
        } catch (Exception e) {
            log.debug("Employee lookup failed for userId {}: {}", userId, e.getMessage());
        }

        // 3️⃣ Not found anywhere
        return null;
    }


    // --------------------------------------------------------------
    // Helper: Get User Email from Employee object (new)
    // --------------------------------------------------------------
    private String getUserEmailFromEmployee(Employee emp) {
        if (emp == null) return null;
        return getUserEmail(emp.getId());
    }

    // --------------------------------------------------------------
    // Helper: Schedule Due Soon & Overdue Notifications
    // --------------------------------------------------------------
    private void scheduleDueReminders(Bug bug) {
        if (bug.getDueDate() == null) return;

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueSoon = bug.getDueDate().minusDays(1);

        if (dueSoon.isAfter(now)) {
            long delayMs = java.time.Duration.between(now, dueSoon).toMillis();
            taskScheduler.schedule(() -> onBugDueSoon(bug.getId()),
                    new java.util.Date(System.currentTimeMillis() + delayMs));
            log.info("⏳ Scheduled due soon reminder for Bug [{}] at {}", bug.getId(), dueSoon);
        }

        if (bug.getDueDate().isAfter(now)) {
            long delayMs = java.time.Duration.between(now, bug.getDueDate()).toMillis();
            taskScheduler.schedule(() -> onBugOverdue(bug.getId()),
                    new java.util.Date(System.currentTimeMillis() + delayMs));
            log.info("📆 Scheduled overdue reminder for Bug [{}] at {}", bug.getId(), bug.getDueDate());
        }
    }
}
