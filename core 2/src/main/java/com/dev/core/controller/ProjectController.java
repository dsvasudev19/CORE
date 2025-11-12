package com.dev.core.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.ProjectDTO;
import com.dev.core.service.ProjectService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectDTO dto) {
        log.info("📦 Creating new project: {}", dto.getName());
        return helper.success("Project created successfully", projectService.createProject(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody ProjectDTO dto) {
        log.info("✏️ Updating project {}", id);
        return helper.success("Project updated successfully", projectService.updateProject(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        log.info("🗑️ Deleting project {}", id);
        projectService.deleteProject(id);
        return helper.success("Project deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        log.info("🔍 Fetching project {}", id);
        return helper.success("Project fetched", projectService.getProjectById(id));
    }

    @GetMapping
    public ResponseEntity<?> getAllProjects(@RequestParam Long organizationId) {
        log.info("📋 Fetching all projects for org {}", organizationId);
        List<ProjectDTO> list = projectService.getAllProjects(organizationId);
        return helper.success("Projects fetched", list);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getProjectsByClient(@RequestParam Long organizationId,
                                                 @PathVariable Long clientId) {
        log.info("📋 Fetching projects for client {}", clientId);
        List<ProjectDTO> list = projectService.getProjectsByClient(organizationId, clientId);
        return helper.success("Client projects fetched", list);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProjects(@RequestParam Long organizationId,
                                            @RequestParam(required = false) String keyword,
                                            Pageable pageable) {
        log.info("🔍 Searching projects with keyword '{}' for org {}", keyword, organizationId);
        Page<ProjectDTO> page = projectService.searchProjects(organizationId, keyword, pageable);
        return helper.success("Projects searched", page);
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateProjectStatus(@PathVariable Long id,
                                                 @RequestParam String status) {
        log.info("⚙️ Updating status for project {} -> {}", id, status);
        return helper.success("Project status updated", projectService.updateStatus(id, status));
    }

    @PostMapping("/{id}/progress/recalculate")
    public ResponseEntity<?> recalculateProgress(@PathVariable Long id) {
        log.info("📊 Recalculating progress for project {}", id);
        projectService.recalculateProjectProgress(id);
        return helper.success("Project progress recalculated successfully");
    }
}

