package com.dev.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "audit_logs",
       indexes = {
           @Index(columnList = "organization_id"),
           @Index(columnList = "user_id")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Column(name = "user_id")
    private Long userId; // actor

    @Column(name = "action", length = 200, nullable = false)
    private String action; // e.g., "USER_LOGIN", "ROLE_UPDATED"

    @Column(name = "entity_name", length = 200)
    private String entityName;

    @Column(name = "entity_id")
    private Long entityId;

    @Lob
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON string or other details
}