package com.dev.core.service.impl;

import com.dev.core.domain.Project;
import com.dev.core.domain.Sprint;
import com.dev.core.mapper.SprintMapper;
import com.dev.core.model.SprintDTO;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.SprintRepository;
import com.dev.core.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    @Override
    public SprintDTO createSprint(SprintDTO dto) {
        Sprint sprint = SprintMapper.toEntity(dto);
        
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            sprint.setProject(project);
        }
        
        if (sprint.getStatus() == null) {
            sprint.setStatus(Sprint.SprintStatus.PLANNING);
        }
        
        Sprint saved = sprintRepository.save(sprint);
        return SprintMapper.toDTO(saved);
    }

    @Override
    public SprintDTO updateSprint(Long id, SprintDTO dto) {
        Sprint existing = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        
        existing.setName(dto.getName());
        existing.setGoal(dto.getGoal());
        existing.setStatus(dto.getStatus());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        
        if (dto.getProjectId() != null && !dto.getProjectId().equals(
                existing.getProject() != null ? existing.getProject().getId() : null)) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            existing.setProject(project);
        }
        
        Sprint updated = sprintRepository.save(existing);
        return SprintMapper.toDTO(updated);
    }

    @Override
    public void deleteSprint(Long id) {
        sprintRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public SprintDTO getSprintById(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        return SprintMapper.toDTO(sprint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SprintDTO> getAllSprints(Long organizationId) {
        return sprintRepository.findByOrganizationId(organizationId).stream()
                .map(SprintMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SprintDTO> getSprintsByProject(Long projectId) {
        return sprintRepository.findByProjectId(projectId).stream()
                .map(SprintMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SprintDTO startSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        sprint.setStatus(Sprint.SprintStatus.ACTIVE);
        Sprint updated = sprintRepository.save(sprint);
        return SprintMapper.toDTO(updated);
    }

    @Override
    public SprintDTO completeSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        sprint.setStatus(Sprint.SprintStatus.COMPLETED);
        Sprint updated = sprintRepository.save(sprint);
        return SprintMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SprintDTO> getActiveSprints(Long organizationId) {
        return sprintRepository.findByOrganizationId(organizationId).stream()
                .filter(sprint -> sprint.getStatus() == Sprint.SprintStatus.ACTIVE)
                .map(SprintMapper::toDTO)
                .collect(Collectors.toList());
    }
}
