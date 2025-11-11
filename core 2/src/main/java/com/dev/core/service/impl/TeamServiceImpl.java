package com.dev.core.service.impl;

import com.dev.core.domain.*;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.TeamMapper;
import com.dev.core.model.TeamDTO;
import com.dev.core.repository.*;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.TeamService;
import com.dev.core.service.validation.TeamValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamValidator teamValidator;
    private final AuthorizationService authorizationService;

    /**
     * RBAC helper
     */
    private void authorize(String action) {
        authorizationService.authorize("TEAM", action);
    }

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    @Override
    public TeamDTO createTeam(TeamDTO dto) {
        authorize("CREATE");
        teamValidator.validateBeforeCreate(dto);

        Team entity = TeamMapper.toEntity(dto);

        // Attach department
        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ValidationFailedException("error.department.notfound", new Object[]{dto.getDepartmentId()}));
            entity.setDepartment(dept);
        }

        // Attach manager
        if (dto.getManagerId() != null) {
            Employee manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{dto.getManagerId()}));
            entity.setManager(manager);
        }

        Team saved = teamRepository.save(entity);
        log.info("✅ Team created: {} (Org={})", saved.getName(), saved.getOrganizationId());

        return TeamMapper.toDTO(saved);
    }

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    @Override
    public TeamDTO updateTeam(Long id, TeamDTO dto) {
        authorize("UPDATE");
        teamValidator.validateBeforeUpdate(id, dto);

        Team existing = teamRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.team.notfound", new Object[]{id}));

        if (dto.getName() != null) existing.setName(dto.getName());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ValidationFailedException("error.department.notfound", new Object[]{dto.getDepartmentId()}));
            existing.setDepartment(dept);
        }

        if (dto.getManagerId() != null) {
            Employee manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{dto.getManagerId()}));
            existing.setManager(manager);
        }

        Team updated = teamRepository.save(existing);
        log.info("✏️ Team updated: {}", updated.getName());
        return TeamMapper.toDTO(updated);
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    @Override
    public void deleteTeam(Long id) {
        authorize("DELETE");
        if (id == null)
            throw new ValidationFailedException("error.team.id.required", "Team ID is required");

        if (!teamRepository.existsById(id))
            throw new ValidationFailedException("error.team.notfound", new Object[]{id});

        teamRepository.deleteById(id);
        log.info("🗑️ Team deleted: {}", id);
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public TeamDTO getTeamById(Long id) {
        authorize("READ");
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.team.notfound", new Object[]{id}));
        return TeamMapper.toDTO(team);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamDTO> getAllTeams(Long organizationId) {
        authorize("READ");
        return teamRepository.findByOrganizationId(organizationId)
                .stream()
                .map(TeamMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamDTO> searchTeams(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");
        Page<Team> page = teamRepository.findAll(
                SpecificationBuilder.of(Team.class)
                        .equals("organizationId", organizationId)
                        .contains("name", keyword)
                        .build(),
                pageable
        );
        return page.map(TeamMapper::toDTO);
    }

    // ---------------------------------------------------------------------
    // MEMBER MANAGEMENT
    // ---------------------------------------------------------------------
    @Override
    public void addMember(Long teamId, Long employeeId, boolean isLead, boolean isManager) {
        authorize("UPDATE");
        teamValidator.validateAddMember(teamId, employeeId);

        boolean alreadyMember = teamMemberRepository.existsByTeam_IdAndEmployee_Id(teamId, employeeId);
        if (alreadyMember)
            throw new ValidationFailedException("error.teammember.exists", new Object[]{employeeId, teamId});

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ValidationFailedException("error.team.notfound", new Object[]{teamId}));

        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setEmployee(emp);
        member.setLead(isLead);
        member.setManager(isManager);
        member.setOrganizationId(team.getOrganizationId());

        teamMemberRepository.save(member);
        log.info("👥 Employee {} added to team {} (Lead={}, Manager={})", employeeId, teamId, isLead, isManager);
    }

    @Override
    public void removeMember(Long teamId, Long employeeId) {
        authorize("UPDATE");

        TeamMember member = teamMemberRepository.findByTeam_Id(teamId).stream()
                .filter(m -> m.getEmployee().getId().equals(employeeId))
                .findFirst()
                .orElseThrow(() -> new ValidationFailedException("error.teammember.notfound", new Object[]{employeeId, teamId}));

        teamMemberRepository.delete(member);
        log.info("👋 Employee {} removed from team {}", employeeId, teamId);
    }

    @Override
    public void setTeamLead(Long teamId, Long employeeId) {
        authorize("UPDATE");
        List<TeamMember> members = teamMemberRepository.findByTeam_Id(teamId);
        if (members.isEmpty())
            throw new ValidationFailedException("error.team.nomembers", new Object[]{teamId});

        for (TeamMember m : members) {
            m.setLead(m.getEmployee().getId().equals(employeeId));
            teamMemberRepository.save(m);
        }

        log.info("⭐ Employee {} set as lead for team {}", employeeId, teamId);
    }

    @Override
    public void changeManager(Long teamId, Long managerId) {
        authorize("UPDATE");

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ValidationFailedException("error.team.notfound", new Object[]{teamId}));

        Employee manager = employeeRepository.findById(managerId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{managerId}));

        team.setManager(manager);
        teamRepository.save(team);
        log.info("🧑‍💼 Manager for team {} changed to employee {}", teamId, managerId);
    }

    // ---------------------------------------------------------------------
    // ANALYTICS
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public long getTeamSize(Long teamId) {
        authorize("READ");
        long count = teamMemberRepository.findByTeam_Id(teamId).size();
        log.debug("👥 Team {} size: {}", teamId, count);
        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamDTO> getTeamsByDepartment(Long organizationId, Long departmentId) {
        authorize("READ");
        return teamRepository.findByOrganizationIdAndDepartment_Id(organizationId, departmentId)
                .stream()
                .map(TeamMapper::toDTO)
                .collect(Collectors.toList());
    }
}
