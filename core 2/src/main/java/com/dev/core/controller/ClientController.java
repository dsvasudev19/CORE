package com.dev.core.controller;

import com.dev.core.model.ClientDTO;
import com.dev.core.model.ClientDocumentDTO;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.ClientDocumentService;
import com.dev.core.service.ClientService;
import com.dev.core.service.file.FileStorageService;

import jakarta.validation.groups.Default;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@Validated
public class ClientController {

    private final ClientService clientService;

    private final FileStorageService fileStorageService;
    private final ClientDocumentService clientDocumentService;
    private final SecurityContextUtil securityContextUtil;


    // =====================================================================
    // CREATE – Full client with optional documents + representatives
    // =====================================================================
    @PostMapping
    public ResponseEntity<ClientDTO> createClient(
            @RequestBody  ClientDTO dto) {
        ClientDTO created = clientService.createClient(dto);
        return ResponseEntity.status(201).body(created); // 201 Created
    }

    // =====================================================================
    // UPDATE – Full replace/sync of client + nested data
    // =====================================================================
    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(
            @PathVariable Long id,
            @RequestBody  ClientDTO dto) {
        ClientDTO updated = clientService.updateClient(id, dto);
        return ResponseEntity.ok(updated);
    }

    // =====================================================================
    // DETAILED VIEW – Returns client with full nested collections
    // =====================================================================
    @GetMapping("/{id}/detailed")
    public ResponseEntity<ClientDTO> getClientDetailed(@PathVariable Long id) {
        ClientDTO detailed = clientService.getClientDetailed(id);
        return ResponseEntity.ok(detailed);
    }

    // =====================================================================
    // BASIC VIEWS (kept for backward compatibility or list screens)
    // =====================================================================
    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id)); // flat version
    }

    @GetMapping("/organization/{orgId}")
    public ResponseEntity<List<ClientDTO>> getAllActiveClients(@PathVariable Long orgId) {
        return ResponseEntity.ok(clientService.getAllActiveClients(orgId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClientDTO>> searchClients(
            @RequestParam Long organizationId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(clientService.searchClients(organizationId, keyword));
    }

    // =====================================================================
    // SOFT DELETE / ACTIVATE
    // =====================================================================
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateClient(@PathVariable Long id) {
        clientService.deactivateClient(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateClient(@PathVariable Long id) {
        clientService.activateClient(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping(value = "/{clientId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClientDocumentDTO> uploadDocument(
            @PathVariable Long clientId,
            @RequestPart("file") MultipartFile file,
            @RequestPart("title") String title,
            @RequestPart(value = "category", required = false) String category,
            @RequestPart(value = "description", required = false) String description) {

        // Store file and get fileId
        String fileId = fileStorageService.storeFile(file, clientId);

        ClientDocumentDTO dto = new ClientDocumentDTO();
        dto.setClientId(clientId);
        dto.setFileId(fileId);
        dto.setTitle(title);
        dto.setCategory(category != null ? category : "General");
        dto.setDescription(description);
        dto.setUploadedBy(securityContextUtil.getCurrentUserId()); // from security context
        dto.setOrganizationId(securityContextUtil.getCurrentOrganizationId());
        ClientDocumentDTO saved = clientDocumentService.addDocument(dto);
        return ResponseEntity.status(201).body(saved);
    }

    // ====================== DOWNLOAD ======================
    @GetMapping("/documents/{documentId}/file")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long documentId,
            @RequestParam String fileId) throws MalformedURLException {

        ClientDocumentDTO doc = clientDocumentService.getDocumentById(documentId);
        Path filePath = fileStorageService.getFilePath(fileId, doc.getClientId());

        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getTitle() + "\"")
                .body(resource);
    }
}