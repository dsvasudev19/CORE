package com.dev.core.scheduler.task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.TaskStatus;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.service.NotificationService;
import com.dev.core.service.task.TaskAutomationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Scheduled job that periodically checks for:
 *  - Tasks that are due soon (within 24 hours)
 *  - Tasks that are overdue
 * 
 * Triggers corresponding automation hooks.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TaskAutomationScheduler {

    private final TaskRepository taskRepository;
    private final TaskAutomationService taskAutomationService;
    
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    /**
     * Runs every morning at 9:00 AM
     * You can adjust via cron: second minute hour day month weekday
     * Example: 0 0 9 * * *  -> 9:00 AM daily
     */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional(readOnly = true)
    public void checkDueAndOverdueTasks() {
        log.info("⏰ [Scheduler] Checking task due dates...");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24h = now.plusHours(24);

        List<Task> dueSoon = taskRepository.findTasksDueBefore(next24h);
        List<Task> overdue = taskRepository.findOverdueTasks();

        dueSoon.forEach(task -> taskAutomationService.onTaskDueSoon(task.getId()));
        overdue.forEach(task -> taskAutomationService.onTaskOverdue(task.getId()));

        log.info("✅ [Scheduler] Notified {} due-soon tasks and {} overdue tasks.", dueSoon.size(), overdue.size());
    }
    
    @Scheduled(cron = "0 30 9 * * *") // 9:30 AM daily
    @Transactional
    public void autoCloseParentTasks() {
        log.info("🤖 [Scheduler] Checking for auto-close parent tasks...");

        List<Task> parentTasks = taskRepository.findAll()
                .stream()
                .filter(t -> t.getStatus() != TaskStatus.DONE)
                .filter(t -> t.getSubtasks() != null && !t.getSubtasks().isEmpty())
                .collect(Collectors.toList());

        int closedCount = 0;

        for (Task parent : parentTasks) {
            long total = parent.getSubtasks().size();
            long done = parent.getSubtasks().stream()
                    .filter(s -> s.getStatus() == TaskStatus.DONE)
                    .count();

            if (total > 0 && done == total) {
                taskAutomationService.onSubtaskAllDone(parent.getId());
                closedCount++;
            }
        }

        log.info("✅ [Scheduler] Auto-close check complete. {} parent tasks ready for closure.", closedCount);
    }

    // --------------------------------------------------------------
    // WEEKLY JOB: PROJECT SUMMARY REPORT (Every Monday 8 AM)
    // --------------------------------------------------------------
    @Scheduled(cron = "0 0 8 * * MON") // Every Monday at 8:00 AM
    @Transactional(readOnly = true)
    public void sendWeeklyProjectSummary() {
        log.info("📊 [Scheduler] Sending weekly project summary reports...");

        List<Project> projects = projectRepository.findAll();

        for (Project project : projects) {
            List<Task> tasks = taskRepository.findByProjectId(project.getId());
            if (tasks.isEmpty()) continue;

            long total = tasks.size();
            long done = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
            long inProgress = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
            long backlog = tasks.stream().filter(t -> t.getStatus() == TaskStatus.BACKLOG).count();

            Map<TaskStatus, Long> statusCounts = tasks.stream()
                    .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));

            StringBuilder summary = new StringBuilder();
            summary.append("📅 Weekly Summary for Project: ").append(project.getName()).append("\n\n");
            summary.append("Total Tasks: ").append(total).append("\n");
            summary.append("✅ Completed: ").append(done).append("\n");
            summary.append("🔄 In Progress: ").append(inProgress).append("\n");
            summary.append("🧭 Backlog: ").append(backlog).append("\n\n");

            summary.append("📊 Detailed Breakdown:\n");
            statusCounts.forEach((status, count) -> summary.append(" - ").append(status.name()).append(": ").append(count).append("\n"));

            summary.append("\nKeep up the good work!\n— Automated Report Bot 🤖");

            // Send to project owner or fallback to default admin
            if (project.getCreatedBy() != null) {
                try {
                    notificationService.sendEmail(
                            getProjectOwnerEmail(project.getCreatedBy()),
                            "📈 Weekly Project Summary: " + project.getName(),
                            summary.toString()
                    );
                } catch (Exception e) {
                    log.warn("Failed to send summary for project {}: {}", project.getName(), e.getMessage());
                }
            }
        }

        log.info("✅ [Scheduler] Weekly project summary reports sent.");
    }

    // --------------------------------------------------------------
    // HELPER METHOD
    // --------------------------------------------------------------
    private String getProjectOwnerEmail(Long userId) {
        // ideally use UserRepository via DI, but this is kept simple for clarity
        // you can inject UserRepository to fetch user email by ID
        return "vasudevds1729@gmail.com"; // fallback placeholder
    }

}
