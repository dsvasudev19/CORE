
package com.dev.core.controller;

import java.util.List;
import java.util.Set;

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
import com.dev.core.constants.ProjectRole;
import com.dev.core.constants.ProjectStatus;
import com.dev.core.constants.ProjectType;
import com.dev.core.model.ProjectDTO;
import com.dev.core.model.ProjectMemberDTO;
import com.dev.core.security.SecurityContextUtil;
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
    private final SecurityContextUtil securityContextUtil;

    // -------------------------------------------------------------------------
    // CRUD
    // -------------------------------------------------------------------------
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
        return helper.success("Projects fetched", projectService.getAllProjects(organizationId));
    }

    // -------------------------------------------------------------------------
    // CLIENT PROJECTS
    // -------------------------------------------------------------------------
    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getProjectsByClient(
            @RequestParam Long organizationId,
            @PathVariable Long clientId) {

        log.info("📋 Fetching projects for client {}", clientId);
        List<ProjectDTO> list = projectService.getProjectsByClient(organizationId, clientId);
        return helper.success("Client projects fetched", list);
    }

    // -------------------------------------------------------------------------
    // SEARCH / FILTER
    // -------------------------------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<?> searchProjects(
            @RequestParam Long organizationId,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {

        log.info("🔍 Searching projects with keyword '{}' for org {}", keyword, organizationId);
        Page<ProjectDTO> page = projectService.searchProjects(organizationId, keyword, pageable);
        return helper.success("Projects searched", page);
    }

    @GetMapping("/filter/type")
    public ResponseEntity<?> getProjectsByType(
            @RequestParam Long organizationId,
            @RequestParam ProjectType type) {

        log.info("🔎 Filtering projects by type {} for org {}", type, organizationId);
        return helper.success("Projects filtered", projectService.getProjectsByType(organizationId, type));
    }

    @GetMapping("/filter/status")
    public ResponseEntity<?> getProjectsByStatus(
            @RequestParam Long organizationId,
            @RequestParam ProjectStatus status) {

        log.info("🔎 Filtering projects by status {} for org {}", status, organizationId);
        return helper.success("Projects filtered", projectService.getProjectsByStatus(organizationId, status));
    }

    @GetMapping("/filter/tags")
    public ResponseEntity<?> getProjectsByTags(
            @RequestParam Long organizationId,
            @RequestParam Set<String> tags) {

        log.info("🔎 Filtering projects by tags {}", tags);
        return helper.success("Projects filtered", projectService.getProjectsByTags(organizationId, tags));
    }

    @GetMapping("/member/{userId}")
    public ResponseEntity<?> getProjectsForMember(
            @RequestParam Long organizationId,
            @PathVariable Long userId) {

        log.info("👤 Fetching projects for user {}", userId);
        return helper.success("Member projects fetched", projectService.getProjectsForMember(organizationId, userId));
    }

    @GetMapping("/starred")
    public ResponseEntity<?> getStarredProjects(@RequestParam Long organizationId) {
        log.info("⭐ Fetching starred projects for org {}", organizationId);
        return helper.success("Starred projects fetched", projectService.getStarredProjects(organizationId));
    }

    // -------------------------------------------------------------------------
    // STATUS & PROGRESS
    // -------------------------------------------------------------------------
    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateProjectStatus(
            @PathVariable Long id,
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

    // -------------------------------------------------------------------------
    // PROJECT MEMBERS
    // -------------------------------------------------------------------------
    @GetMapping("/{id}/members")
    public ResponseEntity<?> getMembers(@PathVariable Long id) {
        log.info("👥 Fetching members for project {}", id);
        List<ProjectMemberDTO> members = projectService.getMembers(id);
        return helper.success("Project members fetched", members);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam ProjectRole role,
            @RequestParam(required = false) Double hourlyRate) {

        log.info("➕ Adding member {} to project {}", userId, id);
        ProjectMemberDTO dto = projectService.addMember(id, userId, role, hourlyRate);
        return helper.success("Project member added", dto);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId) {

        log.info("➖ Removing member {} from project {}", userId, id);
        projectService.removeMember(id, userId);
        return helper.success("Project member removed");
    }

    @PutMapping("/{projectId}/members/{userId}/role")
    public ResponseEntity<?> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestParam ProjectRole role) {

        log.info("🔄 Updating role of member {} in project {}", userId, projectId);
        ProjectMemberDTO updated = projectService.updateMemberRole(projectId, userId, role);
        return helper.success("Member role updated", updated);
    }

    // -------------------------------------------------------------------------
    // METADATA UPDATES (TAGS, COLOR, BUDGET, SPENT, STAR)
    // -------------------------------------------------------------------------
    @PutMapping("/{projectId}/color")
    public ResponseEntity<?> updateColor(
            @PathVariable Long projectId,
            @RequestParam String color) {

        log.info("🎨 Updating project {} color -> {}", projectId, color);
        projectService.updateColor(projectId, color);
        return helper.success("Color updated");
    }

    @PutMapping("/{projectId}/tags")
    public ResponseEntity<?> updateTags(
            @PathVariable Long projectId,
            @RequestParam Set<String> tags) {

        log.info("🏷 Updating tags for project {} -> {}", projectId, tags);
        projectService.updateTags(projectId, tags);
        return helper.success("Tags updated");
    }

    @PutMapping("/{projectId}/budget")
    public ResponseEntity<?> updateBudget(
            @PathVariable Long projectId,
            @RequestParam Double budget) {

        log.info("💰 Updating budget for project {} -> {}", projectId, budget);
        projectService.updateBudget(projectId, budget);
        return helper.success("Budget updated");
    }

    @PutMapping("/{projectId}/spent")
    public ResponseEntity<?> updateSpent(
            @PathVariable Long projectId,
            @RequestParam Double spent) {

        log.info("💸 Updating spent amount for project {} -> {}", projectId, spent);
        projectService.updateSpent(projectId, spent);
        return helper.success("Spent amount updated");
    }

    @PutMapping("/{projectId}/star")
    public ResponseEntity<?> toggleStar(
            @PathVariable Long projectId,
            @RequestParam boolean starred) {

        log.info("⭐ Updating star for project {} -> {}", projectId, starred);
        projectService.toggleStar(projectId, starred);
        return helper.success("Project star updated");
    }

    // -------------------------------------------------------------------------
    // ACTIVITY
    // -------------------------------------------------------------------------
    @PostMapping("/{projectId}/activity")
    public ResponseEntity<?> updateLastActivity(@PathVariable Long projectId) {
        log.info("⏱ Updating last activity for project {}", projectId);
        projectService.updateLastActivity(projectId);
        return helper.success("Activity updated");
    }

    // -------------------------------------------------------------------------
    // ARCHIVE / RESTORE
    // -------------------------------------------------------------------------
    @PutMapping("/{projectId}/archive")
    public ResponseEntity<?> archiveProject(@PathVariable Long projectId) {
        log.info("📦 Archiving project {}", projectId);
        projectService.archiveProject(projectId);
        return helper.success("Project archived");
    }

    @PutMapping("/{projectId}/restore")
    public ResponseEntity<?> restoreProject(@PathVariable Long projectId) {
        log.info("♻️ Restoring project {}", projectId);
        projectService.restoreProject(projectId);
        return helper.success("Project restored");
    }

    // -------------------------------------------------------------------------
    // NOTIFICATIONS
    // -------------------------------------------------------------------------
    @PostMapping("/{projectId}/notify")
    public ResponseEntity<?> notifyStakeholders(
            @PathVariable Long projectId,
            @RequestParam String eventType) {

        log.info("📨 Notifying stakeholders of project {} about {}", projectId, eventType);
        projectService.notifyProjectStakeholders(projectId, eventType);
        return helper.success("Notifications sent");
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getMyProjects(@RequestParam Long organizationId) {

        Long userId = securityContextUtil.getCurrentUserId();

        log.info("👤 Fetching projects for logged-in user {}", userId);

        return helper.success(
                "Member projects fetched"+userId,
                projectService.getProjectsForMember(organizationId, userId)
        );
    }
    
    // -------------------------------------------------------------------------
    // ADMIN DASHBOARD - ORGANIZATION OVERVIEW
    // -------------------------------------------------------------------------
    @GetMapping("/organization/{organizationId}/overview")
    public ResponseEntity<?> getOrganizationProjectsOverview(@PathVariable Long organizationId) {
        log.info("📊 Fetching organization projects overview for org {}", organizationId);
        return helper.success("Organization projects overview fetched", 
            projectService.getOrganizationProjectsOverview(organizationId));
    }
    
    @GetMapping("/organization/{organizationId}/statistics")
    public ResponseEntity<?> getOrganizationProjectStatistics(@PathVariable Long organizationId) {
        log.info("📈 Fetching organization project statistics for org {}", organizationId);
        return helper.success("Organization project statistics fetched", 
            projectService.getOrganizationProjectStatistics(organizationId));
    }

}
