package com.dev.core.service;


import com.dev.core.constants.ProjectRole;
import com.dev.core.model.ProjectMemberDTO;

import java.util.List;

public interface ProjectMemberService {

    List<ProjectMemberDTO> getMembers(Long projectId);

    ProjectMemberDTO addMember(Long projectId, Long userId, ProjectRole role, Double hourlyRate);

    void removeMember(Long projectId, Long userId);

    ProjectMemberDTO updateMemberRole(Long projectId, Long userId, ProjectRole newRole);

    boolean isActiveMember(Long projectId, Long userId);
}
