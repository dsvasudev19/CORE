package com.dev.core.service;


import com.dev.core.model.AuditLogDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuditLogService {

    AuditLogDTO logAction(AuditLogDTO dto);

    List<AuditLogDTO> getAuditLogsByOrganization(Long organizationId);

    List<AuditLogDTO> getAuditLogsByUser(Long userId);

    Page<AuditLogDTO> searchAuditLogs(Long organizationId, String keyword, Pageable pageable);
}
