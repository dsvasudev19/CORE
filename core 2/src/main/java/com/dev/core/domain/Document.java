package com.dev.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document extends BaseEntity {

    /**
     * Generic reference to any entity (e.g. "Client", "Employee", "Project").
     * Used for dynamic linking instead of hard foreign keys.
     */
    @Column(name = "entity_type", nullable = false)
    private String entityType;

    /**
     * ID of the specific entity record (e.g. client_id, employee_id, project_id)
     */
    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    /**
     * File reference key, usually UUID or ID from FileResource table.
     */
    @Column(name = "file_id", nullable = false)
    private String fileId;

    /**
     * Display title for the document (e.g., "Signed Contract v2").
     */
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * Document classification.
     * Example: CONTRACT, AGREEMENT, NDA, RESUME, REPORT, INVOICE, etc.
     */
    @Column(name = "category")
    private String category;

    /**
     * Employee or user who uploaded this document.
     */
    @Column(name = "uploaded_by")
    private Long uploadedBy;

    /**
     * Optional notes or summary.
     */
    @Column(name = "description", length = 1000)
    private String description;

    /**
     * Visibility scope: INTERNAL, CLIENT_VISIBLE, CONFIDENTIAL, PUBLIC
     */
    @Column(name = "visibility")
    private String visibility;
}
