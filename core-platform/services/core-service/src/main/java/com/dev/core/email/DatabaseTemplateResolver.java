package com.dev.core.email;

import com.dev.core.domain.email.EmailTemplate;
import com.dev.core.repository.EmailTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.IEngineConfiguration;
import org.thymeleaf.templateresource.ITemplateResource;
import org.thymeleaf.templateresource.StringTemplateResource;
import org.thymeleaf.templateresolver.StringTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;

import java.util.Map;

@Slf4j
@Component
public class DatabaseTemplateResolver extends StringTemplateResolver {
    @Autowired
    private EmailTemplateRepository templateRepo;

    public DatabaseTemplateResolver() {
		super();
        super.setTemplateMode(TemplateMode.HTML); 
        super.setCacheable(false);
        super.setOrder(1);
    }

    @Override
    protected ITemplateResource computeTemplateResource(
            IEngineConfiguration configuration,
            String ownerTemplate,
            String templateName,
            Map<String, Object> templateResolutionAttributes) {

        EmailTemplate emailTemplate = templateRepo.findByCodeAndActiveTrue(templateName)
                .orElse(null);

        if (emailTemplate == null) {
            log.error("❌ DB Email template not found: {}", templateName);
            return null;
        }

        return new StringTemplateResource(emailTemplate.getTemplateHtml());
    }
}
