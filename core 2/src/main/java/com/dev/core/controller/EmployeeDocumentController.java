package com.dev.core.controller;

import com.dev.core.model.EmployeeDocumentDTO;
import com.dev.core.service.EmployeeDocumentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-documents")
@RequiredArgsConstructor
public class EmployeeDocumentController {

    private final EmployeeDocumentService documentService;

    @PostMapping
    public ResponseEntity<EmployeeDocumentDTO> upload(@RequestBody EmployeeDocumentDTO dto) {
        return ResponseEntity.ok(documentService.uploadDocument(dto));
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
}
