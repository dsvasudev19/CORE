package com.dev.core.controller;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.AuditLogDTO;
import com.dev.core.service.AuditLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> log(@RequestBody AuditLogDTO dto) {
        return helper.success("Action logged successfully", auditLogService.logAction(dto));
    }

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<?> getByOrganization(@PathVariable Long organizationId) {
        List<AuditLogDTO> list = auditLogService.getAuditLogsByOrganization(organizationId);
        return helper.success("Audit logs fetched", list);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable Long userId) {
        List<AuditLogDTO> list = auditLogService.getAuditLogsByUser(userId);
        return helper.success("Audit logs fetched", list);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Long organizationId,
                                    @RequestParam(required = false) String keyword,
                                    Pageable pageable) {
        Page<AuditLogDTO> result = auditLogService.searchAuditLogs(organizationId, keyword, pageable);
        return helper.success("Audit logs searched", result);
    }
}
