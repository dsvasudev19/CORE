package com.dev.core.service.validation;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.dev.core.model.email.EmailTemplateDTO;

@Component
public class EmailTemplateValidator {

    public void validate(EmailTemplateDTO dto) {

        if (!StringUtils.hasText(dto.getCode())) {
            throw new IllegalArgumentException("Template code is required");
        }
        if (!StringUtils.hasText(dto.getName())) {
            throw new IllegalArgumentException("Template name is required");
        }
        if (!StringUtils.hasText(dto.getSubject())) {
            throw new IllegalArgumentException("Subject is required");
        }
        if (!StringUtils.hasText(dto.getTemplateHtml())) {
            throw new IllegalArgumentException("HTML template cannot be empty");
        }

        // Optional: Thymeleaf safety check
        if (!dto.getTemplateHtml().contains("<")) {
            throw new IllegalArgumentException("Invalid HTML content");
        }
    }
}

