

package com.dev.core.service.impl.email;

import com.dev.core.domain.email.EmailTemplate;
import com.dev.core.domain.email.EmailTemplateVersion;
import com.dev.core.mapper.email.EmailTemplateMapper;
import com.dev.core.model.email.EmailTemplateDTO;
import com.dev.core.repository.EmailTemplateRepository;
import com.dev.core.repository.EmailTemplateVersionRepository;
import com.dev.core.service.EmailTemplateService;
import com.dev.core.service.validation.EmailTemplateValidator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailTemplateServiceImpl implements EmailTemplateService {

    private final EmailTemplateRepository templateRepo;
    private final EmailTemplateVersionRepository versionRepo;
    private final EmailTemplateValidator validator;
    private final EmailTemplateMapper mapper;

    @Override
    public EmailTemplateDTO createTemplate(EmailTemplateDTO dto) {

        validator.validate(dto);

        EmailTemplate entity = mapper.toEntity(dto);

        EmailTemplate saved = templateRepo.save(entity);

        saveVersion(saved, "Created");

        return mapper.toDTO(saved);
    }

    @Override
    public EmailTemplateDTO updateTemplate(Long id, EmailTemplateDTO dto) {

        EmailTemplate entity = templateRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        validator.validate(dto);

        mapper.updateEntityFromDTO(dto, entity);

        EmailTemplate updated = templateRepo.save(entity);

        saveVersion(updated, "Updated");

        return mapper.toDTO(updated);
    }

    @Override
    public EmailTemplateDTO getTemplate(String code, Long organizationId) {
        EmailTemplate entity = templateRepo
                .findByCodeAndOrganizationIdAndActiveTrue(code, organizationId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        return mapper.toDTO(entity);
    }

    private void saveVersion(EmailTemplate template, String note) {
        EmailTemplateVersion v = new EmailTemplateVersion();

        v.setTemplateId(template.getId());
        v.setTemplateHtml(template.getTemplateHtml());
        v.setSubject(template.getSubject());
        v.setVersionNote(note);

        v.setOrganizationId(template.getOrganizationId());
        v.setCreatedBy(template.getCreatedBy());
        v.setUpdatedBy(template.getUpdatedBy());
        v.setActive(true);

        versionRepo.save(v);
    }
}
