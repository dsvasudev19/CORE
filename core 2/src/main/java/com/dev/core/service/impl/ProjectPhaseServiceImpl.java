package com.dev.core.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectPhase;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ProjectPhaseMapper;
import com.dev.core.model.ProjectPhaseDTO;
import com.dev.core.repository.ProjectPhaseRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ProjectNotificationService;
import com.dev.core.service.ProjectPhaseService;
import com.dev.core.service.validation.ProjectPhaseValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectPhaseServiceImpl implements ProjectPhaseService {

    private final ProjectPhaseRepository phaseRepository;
    private final ProjectRepository projectRepository;
    private final ProjectPhaseValidator validator;
    private final AuthorizationService authorizationService;
    private final ProjectNotificationService notificationService;

    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public ProjectPhaseDTO createPhase(ProjectPhaseDTO dto) {
        authorize("CREATE");
        validator.validateBeforeCreate(dto);

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{dto.getProjectId()}));

        ProjectPhase entity = ProjectPhaseMapper.toEntity(dto, project);
        ProjectPhase saved = phaseRepository.save(entity);

        // Notify stakeholders about new phase creation
        notificationService.sendPhaseUpdateNotification(project.getId(), saved.getId(), "PHASE_CREATED");

        return ProjectPhaseMapper.toDTO(saved);
    }

    @Override
    public ProjectPhaseDTO updatePhase(Long id, ProjectPhaseDTO dto) {
        authorize("UPDATE");
        validator.validateBeforeUpdate(id, dto);

        ProjectPhase existing = phaseRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.phase.not.found", new Object[]{id}));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setStatus(dto.getStatus());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setProgressPercentage(dto.getProgressPercentage());
        existing.setOrderIndex(dto.getOrderIndex());

        ProjectPhase updated = phaseRepository.save(existing);

        notificationService.sendPhaseUpdateNotification(
                existing.getProject().getId(), id, "PHASE_UPDATED"
        );

        return ProjectPhaseMapper.toDTO(updated);
    }

    @Override
    public void deletePhase(Long id) {
        authorize("DELETE");
        validator.validateBeforeDelete(id);

        ProjectPhase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.phase.not.found", new Object[]{id}));

        phaseRepository.delete(phase);

        notificationService.sendPhaseUpdateNotification(
                phase.getProject().getId(), id, "PHASE_DELETED"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectPhaseDTO getPhaseById(Long id) {
        authorize("READ");

        return phaseRepository.findById(id)
                .map(ProjectPhaseMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.phase.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectPhaseDTO> getPhasesByProject(Long projectId) {
        authorize("READ");

        List<ProjectPhase> phases = phaseRepository.findByProjectIdOrderByOrderIndexAsc(projectId);
        return ProjectPhaseMapper.toDTOList(phases);
    }

    @Override
    public void reorderPhases(Long projectId, List<Long> orderedPhaseIds) {
        authorize("UPDATE");
        validator.validateBeforeReorder(projectId, orderedPhaseIds);

        List<ProjectPhase> phases = phaseRepository.findByProjectId(projectId);
        if (phases.isEmpty()) {
            throw new BaseException("error.phase.none.found.for.project", new Object[]{projectId});
        }
        
        for (int i = 0; i < orderedPhaseIds.size(); i++) {
            Long phaseId = orderedPhaseIds.get(i);
            final int orderIndex = i + 1;
            phases.stream()
                    .filter(p -> p.getId().equals(phaseId))
                    .findFirst()
                    .ifPresent(p -> p.setOrderIndex(orderIndex));
        }

        phaseRepository.saveAll(phases);

        notificationService.sendPhaseUpdateNotification(projectId, null, "PHASES_REORDERED");
    }

    @Override
    public void syncProjectProgress(Long projectId) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        List<ProjectPhase> phases = phaseRepository.findByProjectId(projectId);
        if (phases.isEmpty()) {
            project.setProgressPercentage(0);
        } else {
            double avgProgress = phases.stream()
                    .mapToInt(p -> p.getProgressPercentage() == null ? 0 : p.getProgressPercentage())
                    .average().orElse(0);
            project.setProgressPercentage((int) avgProgress);
        }

        projectRepository.save(project);
    }
}
