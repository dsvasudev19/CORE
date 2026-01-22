package com.dev.core.service;

import com.dev.core.model.ProjectPhaseDTO;
import java.util.List;

public interface ProjectPhaseService {

    /**
     * Create a new phase under a project.
     */
    ProjectPhaseDTO createPhase(ProjectPhaseDTO dto);

    /**
     * Update a specific phase.
     */
    ProjectPhaseDTO updatePhase(Long id, ProjectPhaseDTO dto);

    /**
     * Delete a phase by ID.
     */
    void deletePhase(Long id);

    /**
     * Get details of a single phase.
     */
    ProjectPhaseDTO getPhaseById(Long id);

    /**
     * Get all phases for a given project.
     */
    List<ProjectPhaseDTO> getPhasesByProject(Long projectId);

    /**
     * Reorder phases (for UI ordering, Kanban boards).
     */
    void reorderPhases(Long projectId, List<Long> orderedPhaseIds);

    /**
     * Sync project’s overall progress with phase progress.
     */
    void syncProjectProgress(Long projectId);
}
