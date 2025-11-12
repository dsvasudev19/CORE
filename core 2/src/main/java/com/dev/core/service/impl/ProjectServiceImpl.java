package com.dev.core.service.impl;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.dev.core.domain.Project;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ProjectMapper;
import com.dev.core.model.ProjectDTO;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ProjectNotificationService;
import com.dev.core.service.ProjectService;
import com.dev.core.service.validation.ProjectValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectValidator projectValidator;
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
    public ProjectDTO createProject(ProjectDTO dto) {
        authorize("CREATE");
        projectValidator.validateBeforeCreate(dto);

        Project entity = ProjectMapper.toEntity(dto);
        Project saved = projectRepository.save(entity);

        // send notification asynchronously
        notificationService.sendProjectCreatedNotification(saved.getId());

        return ProjectMapper.toDTO(saved);
    }

    @Override
    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        authorize("UPDATE");
        projectValidator.validateBeforeUpdate(id, dto);

        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{id}));

        existing.setName(dto.getName());
        existing.setCode(dto.getCode());
        existing.setDescription(dto.getDescription());
        existing.setClientId(dto.getClientId());
        existing.setStatus(dto.getStatus());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setExpectedDeliveryDate(dto.getExpectedDeliveryDate());
        existing.setActualDeliveryDate(dto.getActualDeliveryDate());
        existing.setProgressPercentage(dto.getProgressPercentage());

        Project updated = projectRepository.save(existing);

        notificationService.sendStatusChangeNotification(updated.getId(), null, updated.getStatus().name());

        return ProjectMapper.toDTO(updated);
    }

    @Override
    public void deleteProject(Long id) {
        authorize("DELETE");
        projectValidator.validateBeforeDelete(id);

        if (!projectRepository.existsById(id)) {
            throw new BaseException("error.project.not.found", new Object[]{id});
        }
        projectRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        authorize("READ");
        return projectRepository.findById(id)
                .map(ProjectMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects(Long organizationId) {
        authorize("READ");
        return ProjectMapper.toDTOList(projectRepository.findByOrganizationId(organizationId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByClient(Long organizationId, Long clientId) {
        authorize("READ");
        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationIdAndClientId(organizationId, clientId)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectDTO> searchProjects(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");

        var spec = SpecificationBuilder.of(Project.class)
                .equals("organizationId", organizationId)
                .contains("name", StringUtils.hasText(keyword) ? keyword : "")
                .build();

        Page<Project> page = projectRepository.findAll(spec, pageable);
        return page.map(ProjectMapper::toDTO);
    }

    @Override
    public void recalculateProjectProgress(Long projectId) {
        authorize("UPDATE");
        projectValidator.validateBeforeProgressRecalculation(projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        // TODO: When task & phase modules are complete, aggregate from them.
        // For now, placeholder logic.
        int progress = project.getPhases() != null && !project.getPhases().isEmpty()
                ? (int) project.getPhases().stream()
                    .mapToInt(p -> p.getProgressPercentage() == null ? 0 : p.getProgressPercentage())
                    .average().orElse(0)
                : 0;

        project.setProgressPercentage(progress);
        projectRepository.save(project);
    }

    @Override
    public ProjectDTO updateStatus(Long projectId, String status) {
        authorize("UPDATE");
        projectValidator.validateStatusChange(projectId, status);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        String oldStatus = project.getStatus().name();
        project.setStatus(Enum.valueOf(com.dev.core.constants.ProjectStatus.class, status));
        Project updated = projectRepository.save(project);

        notificationService.sendStatusChangeNotification(projectId, oldStatus, status);

        return ProjectMapper.toDTO(updated);
    }

    @Override
    public void notifyProjectStakeholders(Long projectId, String eventType) {
        authorize("READ");
        notificationService.sendPhaseUpdateNotification(projectId, null, eventType);
    }
}
