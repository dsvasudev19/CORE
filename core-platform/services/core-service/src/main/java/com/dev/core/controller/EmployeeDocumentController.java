package com.dev.core.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.core.model.EmployeeDocumentDTO;
import com.dev.core.service.EmployeeDocumentService;
import com.dev.core.service.file.FileStorageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employee-documents")
@RequiredArgsConstructor
public class EmployeeDocumentController {

    private final EmployeeDocumentService documentService;
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<EmployeeDocumentDTO> upload(
            @RequestPart("file") MultipartFile file,
            @RequestPart("meta") String metaJson
    ) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        EmployeeDocumentDTO dto = mapper.readValue(metaJson, EmployeeDocumentDTO.class);

        return ResponseEntity.ok(documentService.uploadDocument(file, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDocumentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeDocumentDTO>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(documentService.getDocumentsByEmployee(employeeId));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Void> markVerified(
            @PathVariable Long id,
            @RequestParam boolean verified) {
        documentService.markVerified(id, verified);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        EmployeeDocumentDTO doc = documentService.getDocumentById(id);
        Path path = fileStorageService.getFilePath(doc.getFileId(), doc.getEmployeeId());

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + doc.getDocumentName())
            .body(resource);
    }

}
