package com.dev.core.service;

import com.dev.core.model.DocumentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    // New: upload with MultipartFile and metadata DTO (without fileId)
    DocumentDTO uploadDocument(MultipartFile file, DocumentDTO dto);

    // Keep metadata-only upload (optional)
    DocumentDTO uploadDocument(DocumentDTO dto);

    DocumentDTO updateDocument(Long id, DocumentDTO dto);

    void deactivateDocument(Long id);

    void activateDocument(Long id);

    DocumentDTO getDocumentById(Long id);

    List<DocumentDTO> getDocumentsByEntity(String entityType, Long entityId);

    List<DocumentDTO> getAllDocuments(Long organizationId);

    List<DocumentDTO> getDocumentsByCategory(Long organizationId, String category);

    List<DocumentDTO> searchDocuments(Long organizationId, String keyword);

    Page<DocumentDTO> getAllDocuments(Long organizationId, Pageable pageable);
}
