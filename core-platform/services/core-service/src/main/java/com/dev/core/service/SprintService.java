package com.dev.core.service;

import com.dev.core.model.SprintDTO;

import java.util.List;

public interface SprintService {
    SprintDTO createSprint(SprintDTO dto);
    SprintDTO updateSprint(Long id, SprintDTO dto);
    void deleteSprint(Long id);
    SprintDTO getSprintById(Long id);
    List<SprintDTO> getAllSprints(Long organizationId);
    List<SprintDTO> getSprintsByProject(Long projectId);
    SprintDTO startSprint(Long id);
    SprintDTO completeSprint(Long id);
    List<SprintDTO> getActiveSprints(Long organizationId);
}
