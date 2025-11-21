package com.dev.core.service;

import com.dev.core.model.email.EmailTemplateDTO;

public interface EmailTemplateService {

    EmailTemplateDTO createTemplate(EmailTemplateDTO dto);

    EmailTemplateDTO updateTemplate(Long id, EmailTemplateDTO dto);

    EmailTemplateDTO getTemplate(String code, Long organizationId);
}

