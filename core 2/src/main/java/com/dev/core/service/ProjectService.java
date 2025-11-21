//package com.dev.core.service;
//
//import com.dev.core.model.ProjectDTO;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//
//import java.util.List;
//
//public interface ProjectService {
//
//    /**
//     * Create a new project under an organization.
//     */
//    ProjectDTO createProject(ProjectDTO dto);
//
//    /**
//     * Update an existing project.
//     */
//    ProjectDTO updateProject(Long id, ProjectDTO dto);
//
//    /**
//     * Soft delete a project by ID.
//     */
//    void deleteProject(Long id);
//
//    /**
//     * Fetch a single project by ID.
//     */
//    ProjectDTO getProjectById(Long id);
//
//    /**
//     * Fetch all projects within an organization.
//     */
//    List<ProjectDTO> getAllProjects(Long organizationId);
//
//    /**
//     * Fetch all projects by client ID (for client portal & internal dashboards).
//     */
//    List<ProjectDTO> getProjectsByClient(Long organizationId, Long clientId);
//
//    /**
//     * Search and filter projects by keyword, status, date range, etc.
//     */
//    Page<ProjectDTO> searchProjects(Long organizationId, String keyword, Pageable pageable);
//
//    /**
//     * Update project progress manually or based on linked phases.
//     */
//    void recalculateProjectProgress(Long projectId);
//
//    /**
//     * Change project status (used by managers or automation).
//     */
//    ProjectDTO updateStatus(Long projectId, String status);
//
//    /**
//     * Send project-related email notifications (status changes, phase completion, etc.)
//     */
//    void notifyProjectStakeholders(Long projectId, String eventType);
//}

package com.dev.core.service;

import com.dev.core.constants.ProjectRole;
import com.dev.core.constants.ProjectStatus;
import com.dev.core.constants.ProjectType;
import com.dev.core.model.ProjectDTO;
import com.dev.core.model.ProjectMemberDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface ProjectService {

    // ---------------------------------------------------------
    // CRUD Operations
    // ---------------------------------------------------------
    ProjectDTO createProject(ProjectDTO dto);

    ProjectDTO updateProject(Long id, ProjectDTO dto);

    void deleteProject(Long id); // soft delete recommended

    ProjectDTO getProjectById(Long id);

    List<ProjectDTO> getAllProjects(Long organizationId);

    List<ProjectDTO> getProjectsByClient(Long organizationId, Long clientId);


    // ---------------------------------------------------------
    // Advanced Filtering & Search
    // ---------------------------------------------------------
    Page<ProjectDTO> searchProjects(Long organizationId, String keyword, Pageable pageable);

    List<ProjectDTO> getProjectsByType(Long organizationId, ProjectType type);

    List<ProjectDTO> getProjectsByStatus(Long organizationId, ProjectStatus status);

    List<ProjectDTO> getProjectsByTags(Long organizationId, Set<String> tags);

    List<ProjectDTO> getProjectsForMember(Long organizationId, Long userId);

    List<ProjectDTO> getStarredProjects(Long organizationId);


    // ---------------------------------------------------------
    // Metadata & Updates (Color, Tags, Budget, Starred)
    // ---------------------------------------------------------
    void updateColor(Long projectId, String color);

    void updateTags(Long projectId, Set<String> tags);

    void updateBudget(Long projectId, Double budget);

    void updateSpent(Long projectId, Double spent);

    void toggleStar(Long projectId, boolean starred);

    void updateLastActivity(Long projectId);


    // ---------------------------------------------------------
    // Project Progress / Status
    // ---------------------------------------------------------
    void recalculateProjectProgress(Long projectId);

    ProjectDTO updateStatus(Long projectId, String status);


    // ---------------------------------------------------------
    // Project Members
    // ---------------------------------------------------------
    List<ProjectMemberDTO> getMembers(Long projectId);

    ProjectMemberDTO addMember(Long projectId, Long userId, ProjectRole role, Double hourlyRate);

    void removeMember(Long projectId, Long userId);

    ProjectMemberDTO updateMemberRole(Long projectId, Long userId, ProjectRole newRole);


    // ---------------------------------------------------------
    // Timeline & Dashboard
    // ---------------------------------------------------------
    List<ProjectDTO> getProjectsActiveSince(Long organizationId, LocalDate sinceDate);

    Long countProjectsByStatus(Long organizationId, ProjectStatus status);

    Long countProjectsByType(Long organizationId, ProjectType type);


    // ---------------------------------------------------------
    // Notifications
    // ---------------------------------------------------------
    void notifyProjectStakeholders(Long projectId, String eventType);


    // ---------------------------------------------------------
    // Archive / Restore
    // ---------------------------------------------------------
    void archiveProject(Long projectId);

    void restoreProject(Long projectId);
}

