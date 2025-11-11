//package com.dev.core.service.impl;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.AuditLog;
//import com.dev.core.mapper.AuditLogMapper;
//import com.dev.core.model.AuditLogDTO;
//import com.dev.core.repository.AuditLogRepository;
//import com.dev.core.service.AuditLogService;
//import com.dev.core.service.validation.AuditLogValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class AuditLogServiceImpl implements AuditLogService {
//
//    private final AuditLogRepository auditLogRepository;
//    private final AuditLogValidator auditLogValidator;
//
//    @Override
//    public AuditLogDTO logAction(AuditLogDTO dto) {
//        auditLogValidator.validateBeforeCreate(dto);
//        AuditLog saved = auditLogRepository.save(AuditLogMapper.toEntity(dto));
//        return AuditLogMapper.toDTO(saved);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<AuditLogDTO> getAuditLogsByOrganization(Long organizationId) {
//        return auditLogRepository.findAllByOrganizationIdOrderByCreatedAtDesc(organizationId)
//                .stream().map(AuditLogMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<AuditLogDTO> getAuditLogsByUser(Long userId) {
//        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
//                .stream().map(AuditLogMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<AuditLogDTO> searchAuditLogs(Long organizationId, String keyword, Pageable pageable) {
//        Page<AuditLog> page = auditLogRepository.findAll(
//                SpecificationBuilder.of(AuditLog.class)
//                        .equals("organizationId", organizationId)
//                        .contains("action", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(AuditLogMapper::toDTO);
//    }
//}


package com.dev.core.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.AuditLog;
import com.dev.core.mapper.AuditLogMapper;
import com.dev.core.model.AuditLogDTO;
import com.dev.core.repository.AuditLogRepository;
import com.dev.core.service.AuditLogService;
import com.dev.core.service.AuthorizationService; // ✅ Correct RBAC import
import com.dev.core.service.validation.AuditLogValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogValidator auditLogValidator;
    private final AuthorizationService authorizationService; // ✅ Injected for dynamic RBAC

    /**
     * Helper for dynamic policy-based authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public AuditLogDTO logAction(AuditLogDTO dto) {
        // Generally, logging is a system action, but we still enforce CREATE if needed
        authorize("CREATE"); // ✅ Ensure caller can CREATE AUDITLOG
        auditLogValidator.validateBeforeCreate(dto);

        AuditLog saved = auditLogRepository.save(AuditLogMapper.toEntity(dto));
        return AuditLogMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsByOrganization(Long organizationId) {
        authorize("READ"); // ✅ Ensure caller can READ AUDITLOG
        return auditLogRepository.findAllByOrganizationIdOrderByCreatedAtDesc(organizationId)
                .stream()
                .map(AuditLogMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsByUser(Long userId) {
        authorize("READ"); // ✅ Ensure caller can READ AUDITLOG
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(AuditLogMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> searchAuditLogs(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ"); // ✅ Ensure caller can READ AUDITLOG
        Page<AuditLog> page = auditLogRepository.findAll(
                SpecificationBuilder.of(AuditLog.class)
                        .equals("organizationId", organizationId)
                        .contains("action", keyword)
                        .build(),
                pageable
        );
        return page.map(AuditLogMapper::toDTO);
    }
}
