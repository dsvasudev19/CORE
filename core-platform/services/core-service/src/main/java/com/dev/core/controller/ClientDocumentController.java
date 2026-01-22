// ClientDocumentController.java
package com.dev.core.controller;

import java.net.MalformedURLException;
import java.nio.file.Path;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.core.model.ClientDocumentDTO;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.ClientDocumentService;
import com.dev.core.service.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientDocumentController {

    private final FileStorageService fileStorageService;
    private final ClientDocumentService clientDocumentService;
    private final SecurityContextUtil securityContextUtil;

    // ====================== UPLOAD ======================
//    @PostMapping(value = "/{clientId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<ClientDocumentDTO> uploadDocument(
//            @PathVariable Long clientId,
//            @RequestPart("file") MultipartFile file,
//            @RequestPart("title") String title,
//            @RequestPart(value = "category", required = false) String category,
//            @RequestPart(value = "description", required = false) String description) {
//
//        // Store file and get fileId
//        String fileId = fileStorageService.storeFile(file, clientId);
//
//        ClientDocumentDTO dto = new ClientDocumentDTO();
//        dto.setClientId(clientId);
//        dto.setFileId(fileId);
//        dto.setTitle(title);
//        dto.setCategory(category != null ? category : "General");
//        dto.setDescription(description);
//        dto.setUploadedBy(securityContextUtil.getCurrentUserId()); // from security context
//
//        ClientDocumentDTO saved = clientDocumentService.addDocument(dto);
//        return ResponseEntity.status(201).body(saved);
//    }
//
//    // ====================== DOWNLOAD ======================
//    @GetMapping("/documents/{documentId}/file")
//    public ResponseEntity<Resource> downloadFile(
//            @PathVariable Long documentId,
//            @RequestParam String fileId) throws MalformedURLException {
//
//        ClientDocumentDTO doc = clientDocumentService.getDocumentById(documentId);
//        Path filePath = fileStorageService.getFilePath(fileId, doc.getClientId());
//
//        Resource resource = new UrlResource(filePath.toUri());
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getTitle() + "\"")
//                .body(resource);
//    }
}