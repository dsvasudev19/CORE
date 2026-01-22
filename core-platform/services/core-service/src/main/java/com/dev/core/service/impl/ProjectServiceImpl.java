
package com.dev.core.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.dev.core.constants.OperationType;
import com.dev.core.constants.ProjectActivityType;
import com.dev.core.constants.ProjectRole;
import com.dev.core.constants.ProjectStatus;
import com.dev.core.constants.ProjectType;
import com.dev.core.domain.Client;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectMember;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ProjectMapper;
import com.dev.core.mapper.ProjectMemberMapper;
import com.dev.core.model.ProjectDTO;
import com.dev.core.model.ProjectMemberDTO;
import com.dev.core.model.ProjectPhaseDTO;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.ClientRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.ProjectMemberRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.BaseEntityAuditService;
import com.dev.core.service.ProjectActivityService;
import com.dev.core.service.ProjectMemberService;
import com.dev.core.service.ProjectNotificationService;
import com.dev.core.service.ProjectPhaseService;
import com.dev.core.service.ProjectService;
import com.dev.core.service.UserService;
import com.dev.core.service.validation.ProjectValidator;
import com.dev.core.specification.SpecificationBuilder;
import com.dev.core.util.ProjectActivityUtils;

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
    private final EmployeeRepository employeeRepository;
    private final ProjectActivityService projectActivityService;
    private final SecurityContextUtil securityContextUtil;
    private final UserService userService;

    private Long currentUserId() { return securityContextUtil.getCurrentUserId(); }
    private String currentUsername() {
    	UserDTO user=userService.getUserById(securityContextUtil.getCurrentUserId());
        return user.getUsername();
    }


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
        
        projectActivityService.logActivity(
        	    ProjectActivityUtils.build(
        	        saved.getId(),
        	        currentUserId(),
        	        ProjectActivityType.PROJECT_CREATED,
        	        "Project created: " + saved.getName(),
        	        null,
        	        null
        	    )
        	);

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
        
     // 🔥 ACTIVITY LOG — PROJECT_UPDATED
        projectActivityService.logActivity(
            ProjectActivityUtils.build(
                updated.getId(),
                currentUserId(),
                ProjectActivityType.PROJECT_UPDATED,
                "Project updated: " + updated.getName(),
                null,
                null
            )
        );


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
        
     // 🔥 ACTIVITY LOG — STATUS_CHANGED
        projectActivityService.logActivity(
            ProjectActivityUtils.statusChanged(
                projectId,
                currentUserId(),
                old,
                status
            )
        );

        
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

        if (memberRepository.existsByProjectIdAndEmployeeId(projectId, userId))
            throw new BaseException("error.project.member.exists");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException("error.user.not.found"));

        Employee employee=employeeRepository.findById(userId).orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{userId}));

        
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .employee(employee)
                .role(role)
                .hourlyRate(rate)
                .activeMember(true)
                .joinedAt(LocalDateTime.now())
                .build();

     // 🔥 ACTIVITY LOG — MEMBER_ADDED
        projectActivityService.logActivity(
            ProjectActivityUtils.memberAdded(
                projectId,
                currentUserId(),
                userId,  // the member added
                employee.getFirstName() + " " + employee.getLastName()
            )
        );

        return ProjectMemberMapper.toDTO(memberRepository.save(member));
    }

    @Override
    public void removeMember(Long projectId, Long userId) {
        authorize("UPDATE");

        ProjectMember member = memberRepository.findByProjectIdAndEmployeeId(projectId, userId)
                .orElseThrow(() -> new BaseException("error.project.member.not.found"));

        member.setActiveMember(false);
        member.setLastActivity(LocalDateTime.now());
     // 🔥 ACTIVITY LOG — MEMBER_REMOVED
        projectActivityService.logActivity(
            ProjectActivityUtils.memberRemoved(
                projectId,
                currentUserId(),
                userId,
                member.getEmployee().getFirstName() + " " + member.getEmployee().getLastName()
            )
        );


        memberRepository.save(member);
    }

    @Override
    public ProjectMemberDTO updateMemberRole(Long projectId, Long userId, ProjectRole newRole) {
        authorize("UPDATE");

        ProjectMember member = memberRepository.findByProjectIdAndEmployeeId(projectId, userId)
                .orElseThrow(() -> new BaseException("error.project.member.not.found"));

        member.setRole(newRole);
        member.setLastActivity(LocalDateTime.now());
     // 🔥 ACTIVITY LOG — MEMBER_ROLE_UPDATED
        projectActivityService.logActivity(
            ProjectActivityUtils.build(
                projectId,
                currentUserId(),
                ProjectActivityType.MEMBER_UPDATED,
                "Role updated for " + member.getEmployee().getFirstName()+member.getEmployee().getLastName()+                    " (" + member.getRole()+" → " + newRole + ")",
                null,
                Map.of(
                    "userId", userId,
                    "oldRole", member.getRole(),
                    "newRole", newRole
                )
            )
        );


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
        
     // 🔥 ACTIVITY LOG — COLOR_UPDATED
        projectActivityService.logActivity(
            ProjectActivityUtils.build(
                projectId,
                currentUserId(),
                ProjectActivityType.PROJECT_UPDATED,
                "Project color updated to " + color,
                null,
                java.util.Map.of("color", color)
            )
        );


        projectRepository.save(project);
    }

    @Override
    public void updateTags(Long projectId, Set<String> tags) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setTags(tags);
        project.setLastActivity(LocalDateTime.now());
        
     // 🔥 ACTIVITY LOG — TAG_UPDATED
        projectActivityService.logActivity(
            ProjectActivityUtils.tagsUpdated(
                projectId,
                currentUserId(),
                project.getTags(),
                tags
            )
        );


        projectRepository.save(project);
    }

    @Override
    public void updateBudget(Long projectId, Double budget) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setBudget(budget);
        project.setLastActivity(LocalDateTime.now());
        
     // 🔥 ACTIVITY LOG — BUDGET_UPDATED
        projectActivityService.logActivity(
            ProjectActivityUtils.budgetUpdated(
                projectId,
                currentUserId(),
                project.getBudget(),
                budget
            )
        );


        projectRepository.save(project);
    }

    @Override
    public void updateSpent(Long projectId, Double spent) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setSpent(spent);
        project.setLastActivity(LocalDateTime.now());
     // 🔥 ACTIVITY LOG — SPENT_UPDATED
        projectActivityService.logActivity(
            ProjectActivityUtils.build(
                projectId,
                currentUserId(),
                ProjectActivityType.SPENT_UPDATED,
                "Spent amount updated: " + spent,
                null,
                java.util.Map.of(
                    "oldSpent", project.getSpent(),
                    "newSpent", spent
                )
            )
        );


        projectRepository.save(project);
    }

    @Override
    public void toggleStar(Long projectId, boolean starred) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setIsStarred(starred);
        project.setLastActivity(LocalDateTime.now());
     // 🔥 ACTIVITY LOG — STAR_TOGGLED
        projectActivityService.logActivity(
            ProjectActivityUtils.build(
                projectId,
                currentUserId(),
                ProjectActivityType.PROJECT_UPDATED,
                "Project " + (starred ? "starred" : "unstarred"),
                null,
                java.util.Map.of("isStarred", starred)
            )
        );


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
        
     // 🔥 ACTIVITY LOG — PROJECT_ARCHIVED
        projectActivityService.logActivity(
            ProjectActivityUtils.build(
            		projectId,
                currentUserId(),
                ProjectActivityType.PROJECT_ARCHIVED,
                "Project archived: " + project.getName(),
                null,
                null
            )
        );

        projectRepository.save(project);
    }

    @Override
    public void restoreProject(Long projectId) {
        authorize("UPDATE");

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        project.setActive(true);
     // 🔥 ACTIVITY LOG — PROJECT_RESTORED
        projectActivityService.logActivity(
            ProjectActivityUtils.build(
                projectId,
                currentUserId(),
                ProjectActivityType.PROJECT_RESTORED,
                "Project restored: " + project.getName(),
                null,
                null
            )
        );

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

    // -------------------------------------------------------------------------
    // ORGANIZATION OVERVIEW (ADMIN DASHBOARD)
    // -------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getOrganizationProjectsOverview(Long organizationId) {
        authorize("READ");

        // Get all active projects for the organization
        List<Project> projects = projectRepository.findByOrganizationIdAndActiveTrue(organizationId);
        
        return ProjectMapper.toDTOList(projects);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOrganizationProjectStatistics(Long organizationId) {
        authorize("READ");

        List<Project> allProjects = projectRepository.findByOrganizationIdAndActiveTrue(organizationId);
        
        // Calculate statistics
        long totalProjects = allProjects.size();
        long activeProjects = allProjects.stream()
                .filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS)
                .count();
        long completedProjects = allProjects.stream()
                .filter(p -> p.getStatus() == ProjectStatus.COMPLETED)
                .count();
        long onHoldProjects = allProjects.stream()
                .filter(p -> p.getStatus() == ProjectStatus.ON_HOLD)
                .count();
        
        double totalBudget = allProjects.stream()
                .mapToDouble(p -> p.getBudget() != null ? p.getBudget() : 0.0)
                .sum();
        double totalSpent = allProjects.stream()
                .mapToDouble(p -> p.getSpent() != null ? p.getSpent() : 0.0)
                .sum();
        
        double averageProgress = allProjects.stream()
                .mapToDouble(p -> p.getProgressPercentage() != null ? p.getProgressPercentage() : 0.0)
                .average()
                .orElse(0.0);
        
        // Count by type
        Map<ProjectType, Long> projectsByType = allProjects.stream()
                .collect(Collectors.groupingBy(Project::getProjectType, Collectors.counting()));
        
        // Build response
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalProjects", totalProjects);
        stats.put("activeProjects", activeProjects);
        stats.put("completedProjects", completedProjects);
        stats.put("onHoldProjects", onHoldProjects);
        stats.put("totalBudget", totalBudget);
        stats.put("totalSpent", totalSpent);
        stats.put("budgetUtilization", totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0.0);
        stats.put("averageProgress", averageProgress);
        stats.put("projectsByType", projectsByType);
        
        return stats;
    }

}

