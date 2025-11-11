package com.dev.core.service.impl;

import com.dev.core.domain.Document;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.DocumentMapper;
import com.dev.core.model.DocumentDTO;
import com.dev.core.repository.DocumentRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.DocumentService;
import com.dev.core.service.validation.DocumentValidator;
import com.dev.core.specification.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentValidator documentValidator;
    private final AuthorizationService authorizationService;

    /**
     * Directory where uploaded files are stored. Can be configured in application.properties.
     * Example: app.upload.dir=/var/app/uploads
     */
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private void authorize(String action) {
        String resource = "DOCUMENT";
        authorizationService.authorize(resource, action);
    }

    // -- Multipart upload implementation --
    @Override
    public DocumentDTO uploadDocument(MultipartFile file, DocumentDTO dto) {
        authorize("CREATE");

        // Prepare DTO: entityType/entityId/organizationId must be present for validation
        // dto may not contain fileId yet - we'll set it after storing
        documentValidator.validateForCreate(dto, LocaleContextHolder.getLocale());

        if (file == null || file.isEmpty()) {
            throw new BaseException("validation.document.file.required");
        }

        // Ensure upload dir exists
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate fileId (UUID). Keep original extension if present.
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String uuid = UUID.randomUUID().toString();
            String storedFileName = uuid + ext;
            Path target = uploadPath.resolve(storedFileName);

            // Copy file stream to the target location (replace existing just in case)
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // Populate DocumentDTO with fileId (we store storedFileName as the fileId)
            dto.setFileId(storedFileName);
            if (dto.getTitle() == null || dto.getTitle().isBlank()) {
                dto.setTitle(original != null ? original : storedFileName);
            }

            // Attempt to set uploadedBy from security context (optional)
            Long currentUserId = extractCurrentUserId();
            dto.setUploadedBy(currentUserId);

            Document entity = DocumentMapper.toEntity(dto, null);
            // Save entity
            Document saved = documentRepository.save(entity);
            return DocumentMapper.toDTO(saved);

        } catch (IOException e) {
            throw new BaseException("error.document.upload.failed", new Object[]{e.getMessage()});
        }
    }

    // Optional: keep metadata-only upload (stores record only, no file stored)
    @Override
    public DocumentDTO uploadDocument(DocumentDTO dto) {
        authorize("CREATE");
        documentValidator.validateForCreate(dto, LocaleContextHolder.getLocale());
        // fileId must already be present in dto for this flow
        Document entity = DocumentMapper.toEntity(dto, null);
        Document saved = documentRepository.save(entity);
        return DocumentMapper.toDTO(saved);
    }

    @Override
    public DocumentDTO updateDocument(Long id, DocumentDTO dto) {
        authorize("UPDATE");
        documentValidator.validateForUpdate(id, dto, LocaleContextHolder.getLocale());
        Document existing = documentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));
        DocumentMapper.toEntity(dto, existing);
        Document updated = documentRepository.save(existing);
        return DocumentMapper.toDTO(updated);
    }

    @Override
    public void deactivateDocument(Long id) {
        authorize("DELETE");
        if (id == null) throw new BaseException("error.document.id.required");
        Document existing = documentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));
        existing.setActive(false);
        documentRepository.save(existing);
    }

    @Override
    public void activateDocument(Long id) {
        authorize("UPDATE");
        if (id == null) throw new BaseException("error.document.id.required");
        Document existing = documentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));
        existing.setActive(true);
        documentRepository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentDTO getDocumentById(Long id) {
        authorize("READ");
        return documentRepository.findById(id)
                .map(DocumentMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getDocumentsByEntity(String entityType, Long entityId) {
        authorize("READ");
        return documentRepository.findByEntityTypeAndEntityIdAndActiveTrue(entityType, entityId)
                .stream().map(DocumentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getAllDocuments(Long organizationId) {
        authorize("READ");
        return documentRepository.findByOrganizationIdAndActiveTrue(organizationId)
                .stream().map(DocumentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getDocumentsByCategory(Long organizationId, String category) {
        authorize("READ");
        return documentRepository.findByOrganizationIdAndCategoryIgnoreCase(organizationId, category)
                .stream().map(DocumentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> searchDocuments(Long organizationId, String keyword) {
        authorize("READ");
        Page<Document> page = documentRepository.findAll(
                SpecificationBuilder.of(Document.class)
                        .equals("organizationId", organizationId)
                        
                        .contains("title", keyword)
                        .contains("description", keyword)
                        .build(),
                Pageable.unpaged()
        );
        return page.map(DocumentMapper::toDTO).stream().collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentDTO> getAllDocuments(Long organizationId, Pageable pageable) {
        authorize("READ");
        Page<Document> page = documentRepository.findByOrganizationIdAndActiveTrue(organizationId, pageable);
        return page.map(DocumentMapper::toDTO);
    }

    /**
     * Try to extract current user id from SecurityContext if available.
     * Assumes principal has getUserId() or getId() — adjust to your CustomUserDetails implementation.
     */
    private Long extractCurrentUserId() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal == null) return null;
            // Example: if you use CustomUserDetails with getUserId()
            var cls = principal.getClass();
            try {
                var m = cls.getMethod("getUserId");
                Object val = m.invoke(principal);
                if (val instanceof Long) return (Long) val;
            } catch (NoSuchMethodException ignored) {}
            try {
                var m2 = cls.getMethod("getId");
                Object val = m2.invoke(principal);
                if (val instanceof Long) return (Long) val;
            } catch (NoSuchMethodException ignored) {}
        } catch (Exception ignored) {}
        return null;
    }
}
