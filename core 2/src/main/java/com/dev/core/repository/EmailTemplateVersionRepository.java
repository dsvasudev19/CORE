package com.dev.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.core.domain.email.EmailTemplateVersion;

public interface EmailTemplateVersionRepository extends JpaRepository<EmailTemplateVersion, Long> {

    List<EmailTemplateVersion> findByTemplateIdOrderByCreatedAtDesc(Long templateId);
}
