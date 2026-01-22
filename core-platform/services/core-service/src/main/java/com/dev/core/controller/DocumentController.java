package com.dev.core.controller;

import com.dev.core.model.DocumentDTO;
import com.dev.core.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Validated
public class DocumentController {

    private final DocumentService documentService;

    /**
     * Upload with multipart/form-data:
     * Parts:
     *  - file (binary)
     *  - organizationId (Long)
     *  - entityType (String)
     *  - entityId (Long)
     *  - title (String) optional
     *  - category (String) optional
     *  - visibility (String) optional
     *  - description (String) optional
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestPart("file") MultipartFile file,
            @RequestParam("organizationId") Long organizationId,
            @RequestParam("entityType") String entityType,
            @RequestParam("entityId") Long entityId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "visibility", required = false) String visibility,
            @RequestParam(value = "description", required = false) String description
    ) {
        DocumentDTO dto = DocumentDTO.builder()
                .organizationId(organizationId)
                .entityType(entityType)
                .entityId(entityId)
                .title(title)
                .category(category)
                .visibility(visibility)
                .description(description)
                .build();

        DocumentDTO created = documentService.uploadDocument(file, dto);
        return ResponseEntity.ok(created);
    }

    // Keep other endpoints unchanged (update, get, list, deactivate/activate)...

    @PutMapping("/{id}")
    public ResponseEntity<DocumentDTO> updateDocument(
            @PathVariable Long id,
            @RequestBody DocumentDTO dto) {
        DocumentDTO updated = documentService.updateDocument(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateDocument(@PathVariable Long id) {
        documentService.activateDocument(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateDocument(@PathVariable Long id) {
        documentService.deactivateDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @GetMapping("/entity")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByEntity(
            @RequestParam String entityType,
            @RequestParam Long entityId) {
        return ResponseEntity.ok(documentService.getDocumentsByEntity(entityType, entityId));
    }

    @GetMapping("/organization/{orgId}")
    public ResponseEntity<List<DocumentDTO>> getAllDocuments(@PathVariable Long orgId) {
        return ResponseEntity.ok(documentService.getAllDocuments(orgId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByCategory(
            @RequestParam Long organizationId,
            @PathVariable String category) {
        return ResponseEntity.ok(documentService.getDocumentsByCategory(organizationId, category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentDTO>> searchDocuments(
            @RequestParam Long organizationId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(documentService.searchDocuments(organizationId, keyword));
    }
}
