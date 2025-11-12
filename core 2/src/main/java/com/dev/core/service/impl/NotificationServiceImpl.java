package com.dev.core.service.impl;


import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.dev.core.service.NotificationService;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("📧 Email sent successfully to {}", to);
        } catch (Exception ex) {
            handleNotificationFailure(to, "Failed to send email", ex);
        }
    }

    @Override
    public void sendTemplateEmail(String to, String subject, String templateName, Object variables) {
        // Template handling can be added later (Thymeleaf, Freemarker, etc.)
        log.warn("⚠️ Template-based emails not yet implemented (template: {})", templateName);
    }

    @Override
    public void handleNotificationFailure(String recipient, String reason, Exception ex) {
        log.error("❌ Notification failed for {}: {} | {}", recipient, reason, ex.getMessage());
    }
}

