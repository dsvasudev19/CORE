package com.dev.core.controller;

import com.dev.core.model.DesignationDTO;
import com.dev.core.service.DesignationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
@RequiredArgsConstructor
public class DesignationController {

    private final DesignationService designationService;

    @PostMapping
    public ResponseEntity<DesignationDTO> create(@RequestBody DesignationDTO dto) {
        return ResponseEntity.ok(designationService.createDesignation(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DesignationDTO> update(@PathVariable Long id, @RequestBody DesignationDTO dto) {
        return ResponseEntity.ok(designationService.updateDesignation(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        designationService.deleteDesignation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesignationDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(designationService.getDesignationById(id));
    }

    @GetMapping
    public ResponseEntity<List<DesignationDTO>> getAll(@RequestParam Long organizationId) {
        return ResponseEntity.ok(designationService.getAllDesignations(organizationId));
    }
}
