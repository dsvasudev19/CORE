package com.dev.core.service.impl;

import com.dev.core.domain.Employee;
import com.dev.core.domain.EmployeeDocument;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.EmployeeDocumentMapper;
import com.dev.core.model.EmployeeDocumentDTO;
import com.dev.core.repository.EmployeeDocumentRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.EmployeeDocumentService;
import com.dev.core.service.file.FileStorageService;
import com.dev.core.service.validation.EmployeeDocumentValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EmployeeDocumentServiceImpl implements EmployeeDocumentService {

    private final EmployeeDocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentValidator documentValidator;
    private final AuthorizationService authorizationService;
    private final FileStorageService fileStorageService;

    /**
     * Helper method for RBAC authorization.
     */
    private void authorize(String action) {
        authorizationService.authorize("EMPLOYEE_DOCUMENT", action);
    }

    // ---------------------------------------------------------------------
    // CREATE (UPLOAD)
    // ---------------------------------------------------------------------
    @Override
    public EmployeeDocumentDTO uploadDocument(EmployeeDocumentDTO dto) {
        authorize("CREATE");
        documentValidator.validateBeforeUpload(dto);

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{dto.getEmployeeId()}));

        boolean exists = documentRepository.existsByEmployee_IdAndDocumentName(dto.getEmployeeId(), dto.getDocumentName());
        if (exists)
            throw new ValidationFailedException("error.document.name.exists", new Object[]{dto.getDocumentName()});

        EmployeeDocument entity = EmployeeDocumentMapper.toEntity(dto);
        entity.setEmployee(employee);
        entity.setOrganizationId(employee.getOrganizationId());
        entity.setVerified(false); // default to not verified

        EmployeeDocument saved = documentRepository.save(entity);
        log.info("📎 Uploaded document '{}' for employee {}", dto.getDocumentName(), dto.getEmployeeId());

        return EmployeeDocumentMapper.toDTO(saved);
    }

    @Override
    public EmployeeDocumentDTO uploadDocument(MultipartFile file, EmployeeDocumentDTO dto) {
        authorize("CREATE");
        documentValidator.validateBeforeUpload(dto);

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound",
                        new Object[]{dto.getEmployeeId()}));

        boolean exists = documentRepository.existsByEmployee_IdAndDocumentName(
                dto.getEmployeeId(),
                dto.getDocumentName()
        );

        if (exists)
            throw new ValidationFailedException("error.document.name.exists",
                    new Object[]{dto.getDocumentName()});

        // 👉 Store file physically
        String fileId = fileStorageService.storeFile(file, dto.getEmployeeId());

        // 👉 Store metadata in DB
        EmployeeDocument entity = EmployeeDocumentMapper.toEntity(dto);
        entity.setEmployee(employee);
        entity.setFileId(fileId); // <--- IMPORTANT
        entity.setOrganizationId(employee.getOrganizationId());
        entity.setVerified(false);

        EmployeeDocument saved = documentRepository.save(entity);

        return EmployeeDocumentMapper.toDTO(saved);
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    @Override
    public void deleteDocument(Long id) {
        authorize("DELETE");
        documentValidator.validateBeforeDelete(id);

        documentRepository.deleteById(id);
        log.info("🗑️ Deleted document with ID {}", id);
    }

    // ---------------------------------------------------------------------
    // READ (BY ID)
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public EmployeeDocumentDTO getDocumentById(Long id) {
        authorize("READ");

        EmployeeDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.document.notfound", new Object[]{id}));

        return EmployeeDocumentMapper.toDTO(doc);
    }

    // ---------------------------------------------------------------------
    // READ (BY EMPLOYEE)
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDocumentDTO> getDocumentsByEmployee(Long employeeId) {
        authorize("READ");

        List<EmployeeDocument> documents = documentRepository.findByEmployee_Id(employeeId);
        if (documents.isEmpty())
            log.debug("⚠️ No documents found for employee {}", employeeId);

        return documents.stream()
                .map(EmployeeDocumentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // VERIFY DOCUMENT
    // ---------------------------------------------------------------------
    @Override
    public void markVerified(Long documentId, boolean verified) {
        authorize("UPDATE");

        EmployeeDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ValidationFailedException("error.document.notfound", new Object[]{documentId}));

        doc.setVerified(verified);
        documentRepository.save(doc);

        log.info("✅ Document {} verification set to {}", documentId, verified);
    }
}
