

package com.dev.core.mapper.email;

import com.dev.core.domain.email.EmailTemplate;
import com.dev.core.model.email.EmailTemplateDTO;

import org.springframework.stereotype.Component;

@Component
public class EmailTemplateMapper {

    public EmailTemplate toEntity(EmailTemplateDTO dto) {
        EmailTemplate e = new EmailTemplate();

        e.setId(dto.getId());
        e.setCode(dto.getCode());
        e.setName(dto.getName());
        e.setSubject(dto.getSubject());
        e.setTemplateHtml(dto.getTemplateHtml());
        e.setDescription(dto.getDescription());

        e.setOrganizationId(dto.getOrganizationId());
        e.setCreatedBy(dto.getCreatedBy());
        e.setUpdatedBy(dto.getUpdatedBy());
        e.setActive(dto.getActive());

        return e;
    }

    public void updateEntityFromDTO(EmailTemplateDTO dto, EmailTemplate e) {
        e.setCode(dto.getCode());
        e.setName(dto.getName());
        e.setSubject(dto.getSubject());
        e.setTemplateHtml(dto.getTemplateHtml());
        e.setDescription(dto.getDescription());

        e.setOrganizationId(dto.getOrganizationId());
        e.setUpdatedBy(dto.getUpdatedBy());
        e.setActive(dto.getActive());
    }

    public EmailTemplateDTO toDTO(EmailTemplate e) {
        EmailTemplateDTO dto = new EmailTemplateDTO();

        dto.setId(e.getId());
        dto.setCode(e.getCode());
        dto.setName(e.getName());
        dto.setSubject(e.getSubject());
        dto.setTemplateHtml(e.getTemplateHtml());
        dto.setDescription(e.getDescription());

        dto.setOrganizationId(e.getOrganizationId());
        dto.setActive(e.getActive());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        dto.setCreatedBy(e.getCreatedBy());
        dto.setUpdatedBy(e.getUpdatedBy());

        return dto;
    }
}
