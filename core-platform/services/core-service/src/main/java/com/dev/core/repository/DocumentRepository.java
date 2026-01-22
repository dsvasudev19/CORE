package com.dev.core.repository;

import com.dev.core.domain.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long>, JpaSpecificationExecutor<Document> {

    // 🔹 Tenant-aware access
    List<Document> findByOrganizationIdAndActiveTrue(Long organizationId);

    Page<Document> findByOrganizationIdAndActiveTrue(Long organizationId, Pageable pageable);

    // 🔹 Entity-based retrieval
    List<Document> findByEntityTypeAndEntityIdAndActiveTrue(String entityType, Long entityId);

    Page<Document> findByEntityTypeAndEntityIdAndActiveTrue(String entityType, Long entityId, Pageable pageable);

    // 🔹 Filtering by category
    List<Document> findByOrganizationIdAndCategoryIgnoreCase(Long organizationId, String category);

    // 🔹 Search support
    Page<Document> findByOrganizationIdAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            Long organizationId, String title, String description, Pageable pageable);
}
