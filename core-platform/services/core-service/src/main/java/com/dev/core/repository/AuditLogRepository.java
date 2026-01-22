package com.dev.core.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long>, JpaSpecificationExecutor<AuditLog> {

    List<AuditLog> findAllByOrganizationIdOrderByCreatedAtDesc(Long organizationId);

    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<AuditLog> findAllByOrganizationId(Long organizationId, Pageable pageable);

    Page<AuditLog> findByOrganizationIdAndActionContainingIgnoreCase(Long organizationId, String action, Pageable pageable);

    Page<AuditLog> findByOrganizationIdAndEntityNameContainingIgnoreCase(Long organizationId, String entityName, Pageable pageable);
}
