package com.dev.core.scheduler;

import com.dev.core.constants.BugStatus;
import com.dev.core.domain.Bug;
import com.dev.core.repository.bug.BugRepository;
import com.dev.core.service.bug.BugAutomationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BugScheduler {

    private final BugRepository bugRepository;
    private final BugAutomationService bugAutomationService;

    /**
     * Runs daily at 9:00 AM
     *  - Sends due soon reminders (due within 24 hours)
     *  - Sends overdue alerts (past due date)
     */
    @Scheduled(cron = "0 0 9 * * *")  // every day at 9 AM
    public void checkBugDeadlines() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24h = now.plusHours(24);

        log.info("🐞 [BugScheduler] Checking for due-soon and overdue bugs...");

        List<Bug> bugs = bugRepository.findAll();
        int dueSoonCount = 0, overdueCount = 0;

        for (Bug bug : bugs) {
            if (bug.getDueDate() == null || bug.getStatus() == BugStatus.CLOSED)
                continue;

            if (bug.getDueDate().isAfter(now) && bug.getDueDate().isBefore(next24h)) {
                bugAutomationService.onBugDueSoon(bug.getId());
                dueSoonCount++;
            } else if (bug.getDueDate().isBefore(now)) {
                bugAutomationService.onBugOverdue(bug.getId());
                overdueCount++;
            }
        }

        log.info("🐞 [BugScheduler] Completed — {} due soon, {} overdue", dueSoonCount, overdueCount);
    }
}
