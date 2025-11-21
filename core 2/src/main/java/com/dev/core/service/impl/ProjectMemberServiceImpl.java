package com.dev.core.service.impl;


import com.dev.core.constants.ProjectRole;
import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectMember;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ProjectMemberMapper;
import com.dev.core.model.ProjectMemberDTO;
import com.dev.core.repository.ProjectMemberRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ProjectMemberService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        authorizationService.authorize("PROJECT_MEMBER", action);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberDTO> getMembers(Long projectId) {
        authorize("READ");

        return memberRepository.findByProjectIdAndActiveMemberTrue(projectId)
                .stream()
                .map(ProjectMemberMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectMemberDTO addMember(Long projectId, Long userId, ProjectRole role, Double hourlyRate) {
        authorize("CREATE");

        if (memberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new BaseException("error.project.member.exists");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{userId}));

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(role)
                .hourlyRate(hourlyRate)
                .activeMember(true)
                .joinedAt(LocalDateTime.now())
                .build();

        ProjectMember saved = memberRepository.save(member);
        return ProjectMemberMapper.toDTO(saved);
    }

    @Override
    public void removeMember(Long projectId, Long userId) {
        authorize("DELETE");

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

    @Override
    @Transactional(readOnly = true)
    public boolean isActiveMember(Long projectId, Long userId) {
        authorize("READ");

        return memberRepository.findActiveMember(projectId, userId).isPresent();
    }
}
