package com.dev.core.service.impl;


import java.util.Map;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.dev.core.service.NotificationService;
import com.dev.core.service.TemplateRenderService;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;
    private final TemplateRenderService templateRenderService;

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
    public void sendTemplateEmail(String to, String subject, String templateName, Object variablesObj) {

        Map<String, Object> variables =
                variablesObj instanceof Map ? (Map<String, Object>) variablesObj : Map.of("value", variablesObj);

        try {
            String html = templateRenderService.render(templateName, variables);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);

            log.info("📨 Template email '{}' sent to {}", templateName, to);

        } catch (Exception e) {
            log.error("❌ Failed to send template email {} → {}", templateName, e.getMessage(), e);
        }
    }


    @Override
    public void handleNotificationFailure(String recipient, String reason, Exception ex) {
        log.error("❌ Notification failed for {}: {} | {}", recipient, reason, ex.getMessage());
    }
}

