
package com.dev.core.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.dev.core.constants.OperationType;
import com.dev.core.constants.ProjectRole;
import com.dev.core.constants.ProjectStatus;
import com.dev.core.constants.ProjectType;
import com.dev.core.domain.Client;
import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectMember;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ProjectMapper;
import com.dev.core.mapper.ProjectMemberMapper;
import com.dev.core.model.ProjectDTO;
import com.dev.core.model.ProjectMemberDTO;
import com.dev.core.model.ProjectPhaseDTO;
import com.dev.core.repository.ClientRepository;
import com.dev.core.repository.ProjectMemberRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.BaseEntityAuditService;
import com.dev.core.service.ProjectMemberService;
import com.dev.core.service.ProjectNotificationService;
import com.dev.core.service.ProjectPhaseService;
import com.dev.core.service.ProjectService;
import com.dev.core.service.validation.ProjectValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository memberRepository;
    private final ProjectValidator projectValidator;
    private final AuthorizationService authorizationService;
    private final ProjectNotificationService notificationService;
    private final ProjectMemberService projectMemberService;
    private final BaseEntityAuditService baseAuditService;
    private final ProjectPhaseService projectPhaseService;

    private void authorize(String action) {
        authorizationService.authorize("PROJECT", action);
    }

    // -------------------------------------------------------------------------
    // CREATE PROJECT
    // -------------------------------------------------------------------------
    @Override
    public ProjectDTO createProject(ProjectDTO dto) {
        authorize("CREATE");
        projectValidator.validateBeforeCreate(dto);

        Project entity = ProjectMapper.toEntity(dto);

        // Assign Client Only If External
        handleClientAssignment(entity, dto.getProjectType(), dto.getClientId());

        // Set last activity
        entity.setLastActivity(LocalDateTime.now());
        baseAuditService.applyAudit(entity, OperationType.CREATE);

        // Save project first (must have ID before members can be created)
        Project saved = projectRepository.save(entity);

        // 🔥 Create Members If Provided in DTO
        if (dto.getMembers() != null && !dto.getMembers().isEmpty()) {
            dto.getMembers().forEach(member -> {
                projectMemberService.addMember(
                        saved.getId(),
                        member.getUserId(),
                        member.getRole(),
                        member.getHourlyRate()
                );
            });
        }
        
        if (dto.getPhases() != null && !dto.getPhases().isEmpty()) {
            dto.getPhases().forEach(phase -> {
            	ProjectPhaseDTO phaseDTO=new ProjectPhaseDTO();
                phase.setProjectId(saved.getId());      // important!
                BeanUtils.copyProperties(phase, phaseDTO)  ;              projectPhaseService.createPhase(phaseDTO);
            });
        }
        
        Project reloaded = projectRepository.findById(saved.getId())
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        notificationService.sendProjectCreatedNotification(saved.getId());

        return ProjectMapper.toDTO(reloaded);
    }


    // -------------------------------------------------------------------------
    // UPDATE PROJECT
    // -------------------------------------------------------------------------
    @Override
    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        authorize("UPDATE");
        projectValidator.validateBeforeUpdate(id, dto);

        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{id}));

        existing.setName(dto.getName());
        existing.setCode(dto.getCode());
        existing.setDescription(dto.getDescription());
        existing.setStatus(dto.getStatus());
        existing.setProjectType(dto.getProjectType());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setExpectedDeliveryDate(dto.getExpectedDeliveryDate());
        existing.setActualDeliveryDate(dto.getActualDeliveryDate());
        existing.setProgressPercentage(dto.getProgressPercentage());
        existing.setProjectPriority(dto.getPriority());
        existing.setBudget(dto.getBudget());
        existing.setSpent(dto.getSpent());
        existing.setColor(dto.getColor());
        existing.setIsStarred(dto.getIsStarred());
        existing.setTags(dto.getTags());
        existing.setLastActivity(LocalDateTime.now());

        handleClientAssignment(existing, dto.getProjectType(), dto.getClientId());
        
        baseAuditService.applyAudit(existing, OperationType.UPDATE);

        Project updated = projectRepository.save(existing);

        notificationService.sendStatusChangeNotification(updated.getId(), null, updated.getStatus().name());
        return ProjectMapper.toDTO(updated);
    }

    private void handleClientAssignment(Project project, ProjectType type, Long clientId) {
        if (type == ProjectType.EXTERNAL) {
            if (clientId == null)
                throw new BaseException("error.client.required.for.external.project");

            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{clientId}));

            project.setClient(client);

        } else {
            project.setClient(null);
        }
    }

    // -------------------------------------------------------------------------
    // SOFT DELETE PROJECT
    // -------------------------------------------------------------------------
    @Override
    public void deleteProject(Long id) {
        authorize("DELETE");
        projectValidator.validateBeforeDelete(id);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setActive(false);
        baseAuditService.applyAudit(project, OperationType.DELETE);
        projectRepository.save(project);
    }

    // -------------------------------------------------------------------------
    // GET PROJECT BY ID
    // -------------------------------------------------------------------------
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

        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationId(organizationId)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByClient(Long organizationId, Long clientId) {
        authorize("READ");

        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationIdAndClientId(organizationId, clientId)
        );
    }

    // -------------------------------------------------------------------------
    // SEARCH / FILTER
    // -------------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public Page<ProjectDTO> searchProjects(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");

        var spec = SpecificationBuilder.of(Project.class)
                .equals("organizationId", organizationId)
                .contains("name", StringUtils.hasText(keyword) ? keyword : null)
                .contains("tags", keyword)
                .contains("description", keyword)
                .build();

        return projectRepository.findAll(spec, pageable)
                .map(ProjectMapper::toDTO);
    }

    // -------------------------------------------------------------------------
    // PROGRESS
    // -------------------------------------------------------------------------
    @Override
    public void recalculateProjectProgress(Long projectId) {
        authorize("UPDATE");
        projectValidator.validateBeforeProgressRecalculation(projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        int progress = project.getPhases() == null || project.getPhases().isEmpty()
                ? 0
                : (int) project.getPhases().stream()
                .mapToInt(p -> p.getProgressPercentage() == null ? 0 : p.getProgressPercentage())
                .average()
                .orElse(0);

        project.setProgressPercentage(progress);
        project.setLastActivity(LocalDateTime.now());
        projectRepository.save(project);
    }

    // -------------------------------------------------------------------------
    // STATUS UPDATE
    // -------------------------------------------------------------------------
    @Override
    public ProjectDTO updateStatus(Long projectId, String status) {
        authorize("UPDATE");
        projectValidator.validateStatusChange(projectId, status);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        String old = project.getStatus().name();
        project.setStatus(ProjectStatus.valueOf(status));
        project.setLastActivity(LocalDateTime.now());

        Project updated = projectRepository.save(project);
        notificationService.sendStatusChangeNotification(projectId, old, status);

        return ProjectMapper.toDTO(updated);
    }

    // -------------------------------------------------------------------------
    // MEMBERS
    // -------------------------------------------------------------------------
    @Override
    public List<ProjectMemberDTO> getMembers(Long projectId) {
        authorize("READ");

        return memberRepository.findByProjectId(projectId)
                .stream()
                .map(ProjectMemberMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectMemberDTO addMember(Long projectId, Long userId, ProjectRole role, Double rate) {
        authorize("UPDATE");

        if (memberRepository.existsByProjectIdAndUserId(projectId, userId))
            throw new BaseException("error.project.member.exists");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException("error.user.not.found"));

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(role)
                .hourlyRate(rate)
                .activeMember(true)
                .joinedAt(LocalDateTime.now())
                .build();

        return ProjectMemberMapper.toDTO(memberRepository.save(member));
    }

    @Override
    public void removeMember(Long projectId, Long userId) {
        authorize("UPDATE");

        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new BaseException("error.project.member.not.found"));

        member.setActiveMember(false);
        member.setLastActivity(LocalDateTime.now());

        memberRepository.save(member);
    }

    @Override
    public ProjectMemberDTO updateMemberRole(Long projectId, Long userId, ProjectRole newRole) {
        authorize("UPDATE");

        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new BaseException("error.project.member.not.found"));

        member.setRole(newRole);
        member.setLastActivity(LocalDateTime.now());

        return ProjectMemberMapper.toDTO(memberRepository.save(member));
    }

    // -------------------------------------------------------------------------
    // METADATA: COLOR, TAGS, BUDGET, STAR
    // -------------------------------------------------------------------------
    @Override
    public void updateColor(Long projectId, String color) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setColor(color);
        project.setLastActivity(LocalDateTime.now());

        projectRepository.save(project);
    }

    @Override
    public void updateTags(Long projectId, Set<String> tags) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setTags(tags);
        project.setLastActivity(LocalDateTime.now());

        projectRepository.save(project);
    }

    @Override
    public void updateBudget(Long projectId, Double budget) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setBudget(budget);
        project.setLastActivity(LocalDateTime.now());

        projectRepository.save(project);
    }

    @Override
    public void updateSpent(Long projectId, Double spent) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setSpent(spent);
        project.setLastActivity(LocalDateTime.now());

        projectRepository.save(project);
    }

    @Override
    public void toggleStar(Long projectId, boolean starred) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setIsStarred(starred);
        project.setLastActivity(LocalDateTime.now());

        projectRepository.save(project);
    }

    // -------------------------------------------------------------------------
    // ACTIVITY
    // -------------------------------------------------------------------------
    @Override
    public void updateLastActivity(Long projectId) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setLastActivity(LocalDateTime.now());
        projectRepository.save(project);
    }

    // -------------------------------------------------------------------------
    // DASHBOARD / METRICS
    // -------------------------------------------------------------------------
    @Override
    public List<ProjectDTO> getProjectsActiveSince(Long organizationId, LocalDate date) {
        authorize("READ");

        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationIdAndLastActivityAfter(
                        organizationId, date.atStartOfDay()
                )
        );
    }

    @Override
    public Long countProjectsByStatus(Long orgId, ProjectStatus status) {
        authorize("READ");
        return projectRepository.countByOrganizationIdAndStatus(orgId, status);
    }

    @Override
    public Long countProjectsByType(Long orgId, ProjectType type) {
        authorize("READ");

        return projectRepository.findByOrganizationIdAndProjectType(orgId, type)
                .stream()
                .count();
    }

    // -------------------------------------------------------------------------
    // ARCHIVE / RESTORE
    // -------------------------------------------------------------------------
    @Override
    public void archiveProject(Long projectId) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setActive(false);
        projectRepository.save(project);
    }

    @Override
    public void restoreProject(Long projectId) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setActive(true);
        projectRepository.save(project);
    }

    // -------------------------------------------------------------------------
    // NOTIFICATIONS
    // -------------------------------------------------------------------------
    @Override
    public void notifyProjectStakeholders(Long projectId, String eventType) {
        authorize("READ");
        notificationService.sendPhaseUpdateNotification(projectId, null, eventType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByType(Long organizationId, ProjectType type) {
        authorize("READ");

        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationIdAndProjectType(organizationId, type)
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByStatus(Long organizationId, ProjectStatus status) {
        authorize("READ");

        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationIdAndStatus(organizationId, status)
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByTags(Long organizationId, Set<String> tags) {
        authorize("READ");

        if (tags == null || tags.isEmpty()) {
            return List.of();
        }

        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationIdAndTagsIn(organizationId, tags)
        );
    }


//    @Override
//    @Transactional(readOnly = true)
//    public List<ProjectDTO> getProjectsForMember(Long organizationId, Long userId) {
//        authorize("READ");
//
//        // If user has no membership entries, return empty
//        List<ProjectMember> memberships = memberRepository.findByUserId(userId);
//        if (memberships.isEmpty()) {
//            return List.of();
//        }
//
//        return ProjectMapper.toDTOList(
//                projectRepository.findProjectsForMember(organizationId, userId)
//        );
//    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsForMember(Long organizationId, Long userId) {
        authorize("READ");

        // A. Projects where user is a member
        List<Project> memberProjects = projectRepository.findProjectsForMember(organizationId, userId);
        System.out.println(memberProjects.get(0).getDescription());
        // B. Projects created by this user
        List<Project> createdProjects = projectRepository.findByOrganizationIdAndCreatedBy(organizationId, userId);

        // Merge both lists (avoid duplicates)
        Set<Project> combined = new LinkedHashSet<>();
        combined.addAll(memberProjects);
        combined.addAll(createdProjects);

        return ProjectMapper.toDTOList(new ArrayList<>(combined));
    }



    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getStarredProjects(Long organizationId) {
        authorize("READ");

        return ProjectMapper.toDTOList(
                projectRepository.findByOrganizationIdAndIsStarredTrue(organizationId)
        );
    }

}
