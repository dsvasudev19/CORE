package com.dev.core.service;

import com.dev.core.model.ProjectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {

    /**
     * Create a new project under an organization.
     */
    ProjectDTO createProject(ProjectDTO dto);

    /**
     * Update an existing project.
     */
    ProjectDTO updateProject(Long id, ProjectDTO dto);

    /**
     * Soft delete a project by ID.
     */
    void deleteProject(Long id);

    /**
     * Fetch a single project by ID.
     */
    ProjectDTO getProjectById(Long id);

    /**
     * Fetch all projects within an organization.
     */
    List<ProjectDTO> getAllProjects(Long organizationId);

    /**
     * Fetch all projects by client ID (for client portal & internal dashboards).
     */
    List<ProjectDTO> getProjectsByClient(Long organizationId, Long clientId);

    /**
     * Search and filter projects by keyword, status, date range, etc.
     */
    Page<ProjectDTO> searchProjects(Long organizationId, String keyword, Pageable pageable);

    /**
     * Update project progress manually or based on linked phases.
     */
    void recalculateProjectProgress(Long projectId);

    /**
     * Change project status (used by managers or automation).
     */
    ProjectDTO updateStatus(Long projectId, String status);

    /**
     * Send project-related email notifications (status changes, phase completion, etc.)
     */
    void notifyProjectStakeholders(Long projectId, String eventType);
}
