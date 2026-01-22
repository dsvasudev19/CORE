package com.dev.core.repository;

import com.dev.core.domain.SecurityAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SecurityAuditLogRepository extends JpaRepository<SecurityAuditLog, Long> {
}