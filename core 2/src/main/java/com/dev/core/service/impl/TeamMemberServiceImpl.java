package com.dev.core.service.impl;

import com.dev.core.domain.Employee;
import com.dev.core.domain.Team;
import com.dev.core.domain.TeamMember;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.TeamMemberMapper;
import com.dev.core.model.TeamMemberDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.TeamMemberRepository;
import com.dev.core.repository.TeamRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.TeamMemberService;
import com.dev.core.service.validation.TeamMemberValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TeamMemberServiceImpl implements TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final EmployeeRepository employeeRepository;
    private final TeamMemberValidator teamMemberValidator;
    private final AuthorizationService authorizationService;

    /**
     * Helper for RBAC-based authorization.
     */
    private void authorize(String action) {
        authorizationService.authorize("TEAM_MEMBER", action);
    }

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    @Override
    public TeamMemberDTO addMember(TeamMemberDTO dto) {
        authorize("CREATE");

        if (dto == null)
            throw new ValidationFailedException("error.teammember.null", "TeamMember data cannot be null");
        if (dto.getTeamId() == null || dto.getEmployeeId() == null)
            throw new ValidationFailedException("error.teammember.invalid", "Team ID and Employee ID are required");

        Team team = teamRepository.findById(dto.getTeamId())
                .orElseThrow(() -> new ValidationFailedException("error.team.notfound", new Object[]{dto.getTeamId()}));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{dto.getEmployeeId()}));

        boolean exists = teamMemberRepository.existsByTeam_IdAndEmployee_Id(dto.getTeamId(), dto.getEmployeeId());
        if (exists)
            throw new ValidationFailedException("error.teammember.exists", new Object[]{dto.getEmployeeId(), dto.getTeamId()});

        TeamMember entity = TeamMemberMapper.toEntity(dto);
        entity.setTeam(team);
        entity.setEmployee(employee);
        entity.setOrganizationId(team.getOrganizationId());

        TeamMember saved = teamMemberRepository.save(entity);
        log.info("👥 Added employee {} to team {} (Lead={}, Manager={})",
                dto.getEmployeeId(), dto.getTeamId(), dto.isLead(), dto.isManager());

        return TeamMemberMapper.toDTO(saved);
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    @Override
    public void removeMember(Long teamMemberId) {
        authorize("DELETE");
        teamMemberValidator.validateBeforeDelete(teamMemberId);

        teamMemberRepository.deleteById(teamMemberId);
        log.info("🗑️ Removed TeamMember with ID {}", teamMemberId);
    }

    // ---------------------------------------------------------------------
    // UPDATE ROLE
    // ---------------------------------------------------------------------
    @Override
    public TeamMemberDTO updateRole(Long teamMemberId, boolean isLead, boolean isManager) {
        authorize("UPDATE");
        teamMemberValidator.validateBeforeUpdate(teamMemberId);

        TeamMember member = teamMemberRepository.findById(teamMemberId)
                .orElseThrow(() -> new ValidationFailedException("error.teammember.notfound", new Object[]{teamMemberId}));

        member.setLead(isLead);
        member.setManager(isManager);

        TeamMember updated = teamMemberRepository.save(member);
        log.info("✏️ Updated TeamMember {} role (Lead={}, Manager={})", teamMemberId, isLead, isManager);

        return TeamMemberMapper.toDTO(updated);
    }

    // ---------------------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public TeamMemberDTO getById(Long id) {
        authorize("READ");

        TeamMember member = teamMemberRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.teammember.notfound", new Object[]{id}));

        return TeamMemberMapper.toDTO(member);
    }

    // ---------------------------------------------------------------------
    // LIST BY TEAM
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberDTO> getMembersByTeam(Long teamId) {
        authorize("READ");

        List<TeamMember> members = teamMemberRepository.findByTeam_Id(teamId);
        if (members.isEmpty())
            log.debug("⚠️ No members found for team {}", teamId);

        return members.stream().map(TeamMemberMapper::toDTO).collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // LIST BY EMPLOYEE
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberDTO> getTeamsByEmployee(Long employeeId) {
        authorize("READ");

        List<TeamMember> memberships = teamMemberRepository.findByEmployee_Id(employeeId);
        if (memberships.isEmpty())
            log.debug("⚠️ Employee {} is not part of any team", employeeId);

        return memberships.stream().map(TeamMemberMapper::toDTO).collect(Collectors.toList());
    }
}
