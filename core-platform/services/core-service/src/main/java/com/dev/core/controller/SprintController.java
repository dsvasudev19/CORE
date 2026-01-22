package com.dev.core.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.model.SprintDTO;
import com.dev.core.service.SprintService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sprint")
@RequiredArgsConstructor
public class SprintController {

    private final SprintService sprintService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<SprintDTO> createSprint(@RequestBody SprintDTO dto) {
        SprintDTO created = sprintService.createSprint(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<SprintDTO> updateSprint(@PathVariable Long id, @RequestBody SprintDTO dto) {
        SprintDTO updated = sprintService.updateSprint(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<SprintDTO> getSprintById(@PathVariable Long id) {
        SprintDTO sprint = sprintService.getSprintById(id);
        return ResponseEntity.ok(sprint);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<SprintDTO>> getAllSprints(@RequestParam Long organizationId) {
        List<SprintDTO> sprints = sprintService.getAllSprints(organizationId);
        return ResponseEntity.ok(sprints);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<SprintDTO>> getSprintsByProject(@PathVariable Long projectId) {
        List<SprintDTO> sprints = sprintService.getSprintsByProject(projectId);
        return ResponseEntity.ok(sprints);
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<SprintDTO> startSprint(@PathVariable Long id) {
        SprintDTO sprint = sprintService.startSprint(id);
        return ResponseEntity.ok(sprint);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<SprintDTO> completeSprint(@PathVariable Long id) {
        SprintDTO sprint = sprintService.completeSprint(id);
        return ResponseEntity.ok(sprint);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<SprintDTO>> getActiveSprints(@RequestParam Long organizationId) {
        List<SprintDTO> sprints = sprintService.getActiveSprints(organizationId);
        return ResponseEntity.ok(sprints);
    }
}
