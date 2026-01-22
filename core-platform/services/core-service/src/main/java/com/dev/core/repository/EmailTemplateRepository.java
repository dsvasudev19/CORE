package com.dev.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.core.domain.email.EmailTemplate;

public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {

    Optional<EmailTemplate> findByCodeAndOrganizationIdAndActiveTrue(String code, Long orgId);

    List<EmailTemplate> findAllByOrganizationId(Long orgId);
    Optional<EmailTemplate> findByCodeAndActiveTrue(String templateName);
}
