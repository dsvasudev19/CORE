package com.dev.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.dev.core.domain.ClientDocument;

public interface ClientDocumentRepository extends JpaRepository<ClientDocument, Long>, JpaSpecificationExecutor<ClientDocument> {

    List<ClientDocument> findByClientIdAndActiveTrue(Long clientId);

    List<ClientDocument> findByOrganizationIdAndActiveTrue(Long organizationId);

    boolean existsByFileId(String fileId);

    // Optional: for future search
    // List<ClientDocument> findByClientIdAndCategoryIgnoreCase(Long clientId, String category);
}