package com.dev.core.service;

import com.dev.core.model.TeamDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TeamService {

    TeamDTO createTeam(TeamDTO dto);

    TeamDTO updateTeam(Long id, TeamDTO dto);

    void deleteTeam(Long id);

    TeamDTO getTeamById(Long id);

    List<TeamDTO> getAllTeams(Long organizationId);

    Page<TeamDTO> searchTeams(Long organizationId, String keyword, Pageable pageable);

    // 🔹 Manage Members
    void addMember(Long teamId, Long employeeId, boolean isLead, boolean isManager);

    void removeMember(Long teamId, Long employeeId);

    void setTeamLead(Long teamId, Long employeeId);

    void changeManager(Long teamId, Long managerId);

    // 🔹 Analytics
    long getTeamSize(Long teamId);

    List<TeamDTO> getTeamsByDepartment(Long organizationId, Long departmentId);
}
