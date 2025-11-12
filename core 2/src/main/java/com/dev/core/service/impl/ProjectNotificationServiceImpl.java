package com.dev.core.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectPhase;
import com.dev.core.exception.BaseException;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.ProjectPhaseRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.service.NotificationService;
import com.dev.core.service.ProjectNotificationService;
import com.dev.core.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProjectNotificationServiceImpl implements ProjectNotificationService {

    private final NotificationService notificationService;
    private final ProjectRepository projectRepository;
    private final ProjectPhaseRepository phaseRepository;
    private final UserService userService;

    @Override
    @Transactional
    public void sendProjectCreatedNotification(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        String subject = "🆕 New Project Created: " + project.getName();
        String body = String.format(
                "Hello,\n\nA new project has been created.\n\n" +
                        "Project: %s\nDescription: %s\nStatus: %s\n\nRegards,\nProject Management System",
                project.getName(),
                project.getDescription() != null ? project.getDescription() : "No description",
                project.getStatus()
        );

        notificationService.sendEmail("admin@system.com", subject, body);
    }

    @Override
    @Transactional
    public void sendStatusChangeNotification(Long projectId, String oldStatus, String newStatus) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        String subject = "📢 Project Status Updated: " + project.getName();
        String body = String.format(
                "Hello,\n\nThe project '%s' status has been updated.\n\n" +
                        "Old Status: %s\nNew Status: %s\n\n" +
                        "Regards,\nProject Management System",
                project.getName(),
                oldStatus != null ? oldStatus : "(unknown)",
                newStatus
        );

        notificationService.sendEmail("admin@system.com", subject, body);
    }

    @Override
    @Transactional
    public void sendPhaseUpdateNotification(Long projectId, Long phaseId, String eventType) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        String phaseName = phaseId != null
                ? phaseRepository.findById(phaseId).map(ProjectPhase::getName).orElse("Unknown Phase")
                : "N/A";

        String subject = "📈 Project Phase Update: " + project.getName();
        String body = String.format(
                "Hello,\n\nA project phase has been %s.\n\n" +
                        "Project: %s\nPhase: %s\nEvent Type: %s\n\n" +
                        "Regards,\nProject Management System",
                eventType.toLowerCase(),
                project.getName(),
                phaseName,
                eventType
        );

        notificationService.sendEmail("admin@system.com", subject, body);
    }

    @Override
    public void notifyClient(Long clientId, String subject, String message) {
        // In real system, we'd fetch client email from ClientRepository
        String clientEmail = "client" + clientId + "@example.com";
        notificationService.sendEmail(clientEmail, subject, message);
    }

    
    @Override
    public void notifyProjectDueSoon(Long projectId) {
        Project project = getProject(projectId);
        log.info("⏰ [ProjectNotification] Project [{}] is nearing its deadline", project.getName());

        // get project owner email
        String ownerEmail = getUserEmail(project.getCreatedBy());
        List<String> recipients = List.of(ownerEmail);

        String subject = "⏰ Project Due Soon: " + project.getName();
        String body = """
                Project "%s" is approaching its deadline.

                End Date: %s
                Current Status: %s
                Description: %s

                Please ensure all pending tasks are completed on time.
                """.formatted(
                project.getName(),
                project.getEndDate() != null ? project.getEndDate() : "N/A",
                project.getStatus(),
                project.getDescription() != null ? project.getDescription() : "No description provided."
        );

        notificationService.sendEmail(recipients, subject, body);
        log.info("📧 [ProjectNotification] Due-soon email sent for project [{}]", project.getId());
    }

    // --------------------------------------------------------------
    // NOTIFY PROJECT OVERDUE
    // --------------------------------------------------------------
    @Override
    public void notifyProjectOverdue(Long projectId) {
        Project project = getProject(projectId);
        log.info("🚨 [ProjectNotification] Project [{}] is overdue", project.getName());

        String ownerEmail = getUserEmail(project.getCreatedBy());
        List<String> recipients = List.of(ownerEmail);

        String subject = "🚨 Overdue Project: " + project.getName();
        String body = """
                Project "%s" has exceeded its planned deadline.

                Original End Date: %s
                Current Status: %s
                Description: %s

                Please review and update the project timeline or mark it as delayed.
                """.formatted(
                project.getName(),
                project.getEndDate() != null ? project.getEndDate() : LocalDate.now(),
                project.getStatus(),
                project.getDescription() != null ? project.getDescription() : "No description provided."
        );

        notificationService.sendEmail(recipients, subject, body);
        log.info("📧 [ProjectNotification] Overdue email sent for project [{}]", project.getId());
    }
    
    private Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));
    }

    // --------------------------------------------------------------
    // Helper: Get User Email (Safe Lookup)
    // --------------------------------------------------------------
    private String getUserEmail(Long userId) {
        if (userId == null) return null;
        try {
            UserDTO user = userService.getUserById(userId);
            return user != null ? user.getEmail() : null;
        } catch (Exception e) {
            log.warn("⚠️ [ProjectNotification] Could not fetch email for user [{}]: {}", userId, e.getMessage());
            return null;
        }
    }
 
}
