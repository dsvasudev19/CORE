package com.dev.core.scheduler;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.dev.core.constants.ProjectStatus;
import com.dev.core.domain.Project;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.service.ProjectNotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectScheduler {

    private final ProjectRepository projectRepository;
    private final ProjectNotificationService projectNotificationService;

    /**
     * Runs daily at 8:30 AM
     *  - Sends notifications for projects nearing deadlines (within 3 days)
     *  - Sends alerts for overdue projects
     *  - Updates project status automatically if needed
     */
    @Scheduled(cron = "0 30 8 * * *")  // every day at 8:30 AM
    public void checkProjectDeadlines() {
        LocalDate now = LocalDate.now();
        LocalDate next3Days = now.plusDays(3);

        log.info("🏗️ [ProjectScheduler] Checking for due soon and overdue projects...");

        List<Project> projects = projectRepository.findAll();
        int dueSoonCount = 0, overdueCount = 0;

        for (Project project : projects) {
            if (project.getEndDate() == null)
                continue;

            if (project.getStatus() == ProjectStatus.COMPLETED || project.getStatus() == ProjectStatus.ARCHIVED)
                continue;

            if (project.getEndDate().isAfter(now) && project.getEndDate().isBefore(next3Days)) {
                projectNotificationService.notifyProjectDueSoon(project.getId());
                dueSoonCount++;
            } else if (project.getEndDate().isBefore(now)) {
                projectNotificationService.notifyProjectOverdue(project.getId());

                if (project.getStatus() != ProjectStatus.DELAYED) {
                    project.setStatus(ProjectStatus.DELAYED);
                    projectRepository.save(project);
                    log.info("⚠️ Auto-marked project [{}] as DELAYED", project.getId());
                }
                overdueCount++;
            }
        }

        log.info("🏗️ [ProjectScheduler] Completed — {} due soon, {} overdue", dueSoonCount, overdueCount);
    }

}
