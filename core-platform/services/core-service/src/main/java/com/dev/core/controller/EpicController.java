package com.dev.core.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dev.core.model.EpicDTO;
import com.dev.core.service.EpicService;

import java.util.List;

@RestController
@RequestMapping("/api/epic")
@RequiredArgsConstructor
public class EpicController {

    private final EpicService epicService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<EpicDTO> createEpic(@RequestBody EpicDTO dto) {
        EpicDTO created = epicService.createEpic(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<EpicDTO> updateEpic(@PathVariable Long id, @RequestBody EpicDTO dto) {
        EpicDTO updated = epicService.updateEpic(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<Void> deleteEpic(@PathVariable Long id) {
        epicService.deleteEpic(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<EpicDTO> getEpicById(@PathVariable Long id) {
        EpicDTO epic = epicService.getEpicById(id);
        return ResponseEntity.ok(epic);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<EpicDTO>> getAllEpics(@RequestParam Long organizationId) {
        List<EpicDTO> epics = epicService.getAllEpics(organizationId);
        return ResponseEntity.ok(epics);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<EpicDTO>> getEpicsByProject(@PathVariable Long projectId) {
        List<EpicDTO> epics = epicService.getEpicsByProject(projectId);
        return ResponseEntity.ok(epics);
    }

    @GetMapping("/key/{key}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<EpicDTO> getEpicByKey(@PathVariable String key) {
        EpicDTO epic = epicService.getEpicByKey(key);
        return ResponseEntity.ok(epic);
    }
}
