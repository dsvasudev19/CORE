package com.dev.core.service;

import com.dev.core.model.TeamMemberDTO;

import java.util.List;

public interface TeamMemberService {

    TeamMemberDTO addMember(TeamMemberDTO dto);

    void removeMember(Long teamMemberId);

    TeamMemberDTO updateRole(Long teamMemberId, boolean isLead, boolean isManager);

    TeamMemberDTO getById(Long id);

    List<TeamMemberDTO> getMembersByTeam(Long teamId);

    List<TeamMemberDTO> getTeamsByEmployee(Long employeeId);
}
