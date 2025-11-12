package com.dev.core.service;

import java.util.List;

public interface NotificationService {

    /**
     * Sends a plain text email.
     *
     * @param to Recipient email
     * @param subject Email subject
     * @param body Message body (plain text)
     */
    void sendEmail(String to, String subject, String body);

    /**
     * Sends an email using a predefined HTML template.
     *
     * @param to Recipient email
     * @param subject Subject
     * @param templateName Template identifier
     * @param variables Variables to render inside the template
     */
    void sendTemplateEmail(String to, String subject, String templateName, Object variables);

    /**
     * Common error logging or fallback for notification failures.
     */
    void handleNotificationFailure(String recipient, String reason, Exception ex);
    
    default void sendEmail(List<String> recipients, String subject, String body) {
        if (recipients == null || recipients.isEmpty()) {
            return;
        }

        for (String email : recipients) {
            if (email == null || email.isBlank()) continue;
            try {
                sendEmail(email, subject, body);
            } catch (Exception ex) {
                handleNotificationFailure(email, "Failed to send email to recipient", ex);
            }
        }
    }
}
