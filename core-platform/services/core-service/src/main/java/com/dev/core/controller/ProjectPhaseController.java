package com.dev.core.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.ProjectPhaseDTO;
import com.dev.core.service.ProjectPhaseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects/phases")
@RequiredArgsConstructor
@Slf4j
public class ProjectPhaseController {

    private final ProjectPhaseService phaseService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> createPhase(@RequestBody ProjectPhaseDTO dto) {
        log.info("🧩 Creating new phase for project {}", dto.getProjectId());
        return helper.success("Phase created successfully", phaseService.createPhase(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhase(@PathVariable Long id, @RequestBody ProjectPhaseDTO dto) {
        log.info("✏️ Updating phase {}", id);
        return helper.success("Phase updated successfully", phaseService.updatePhase(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhase(@PathVariable Long id) {
        log.info("🗑️ Deleting phase {}", id);
        phaseService.deletePhase(id);
        return helper.success("Phase deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPhaseById(@PathVariable Long id) {
        log.info("🔍 Fetching phase {}", id);
        return helper.success("Phase fetched", phaseService.getPhaseById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getPhasesByProject(@PathVariable Long projectId) {
        log.info("📋 Fetching phases for project {}", projectId);
        return helper.success("Phases fetched", phaseService.getPhasesByProject(projectId));
    }

    @PostMapping("/project/{projectId}/reorder")
    public ResponseEntity<?> reorderPhases(@PathVariable Long projectId,
                                           @RequestBody List<Long> orderedPhaseIds) {
        log.info("🔁 Reordering phases for project {}", projectId);
        phaseService.reorderPhases(projectId, orderedPhaseIds);
        return helper.success("Phases reordered successfully");
    }

    @PostMapping("/project/{projectId}/sync-progress")
    public ResponseEntity<?> syncProjectProgress(@PathVariable Long projectId) {
        log.info("📊 Syncing project progress for {}", projectId);
        phaseService.syncProjectProgress(projectId);
        return helper.success("Project progress synced successfully");
    }
}
