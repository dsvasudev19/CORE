package com.dev.core.repository;


import com.dev.core.domain.ProjectMember;
import com.dev.core.constants.ProjectRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    /**
     * Fetch all members in a project.
     */
    List<ProjectMember> findByProjectId(Long projectId);

    /**
     * Fetch only ACTIVE members in a project.
     */
    List<ProjectMember> findByProjectIdAndActiveMemberTrue(Long projectId);

    /**
     * Fetch specific member entry by project + user.
     */
    Optional<ProjectMember> findByProjectIdAndEmployeeId(Long projectId, Long employeeId);

    /**
     * Check if a user is already part of a project.
     */
    boolean existsByProjectIdAndEmployeeId(Long projectId, Long employeeId);

    /**
     * Fetch all projects where user is a member.
     * Useful for "My Projects" feature.
     */
    @Query("""
        select pm.project.id
        from ProjectMember pm
        where pm.employee.id = :employeeId
          and pm.activeMember = true
    """)
    List<Long> findActiveProjectIdsByEmployeeId(Long employeeId);

    /**
     * Fetch all members with a specific role (project-level admin, manager, etc.)
     */
    List<ProjectMember> findByProjectIdAndRole(Long projectId, ProjectRole role);

    /**
     * Fetch all members for a given user (across org).
     * Useful for dashboards.
     */
    List<ProjectMember> findByEmployeeId(Long employeeId);

    /**
     * Fetch active project members for permission checks.
     */
    @Query("""
        select pm
        from ProjectMember pm
        where pm.project.id = :projectId 
          and pm.employee.id = :employeeId 
          and pm.activeMember = true
    """)
    Optional<ProjectMember> findActiveMember(Long projectId, Long employeeId);

    /**
     * Count active members in project.
     */
    Long countByProjectIdAndActiveMemberTrue(Long projectId);
}
