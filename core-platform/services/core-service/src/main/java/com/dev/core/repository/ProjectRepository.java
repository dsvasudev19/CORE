package com.dev.core.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dev.core.constants.ProjectStatus;
import com.dev.core.constants.ProjectType;
import com.dev.core.domain.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
	
	Optional<Project> findByCode(String code);

	/**
	 * Fetch all projects belonging to an organization.
	 */
	List<Project> findByOrganizationId(Long organizationId);

	/**
	 * Fetch all projects under an organization and specific client.
	 */
	List<Project> findByOrganizationIdAndClientId(Long organizationId, Long clientId);

	/**
	 * Find by unique code within organization (if used for lookup).
	 */
	Optional<Project> findByOrganizationIdAndCode(Long organizationId, String code);

	/**
	 * Find by status and organization.
	 */
	List<Project> findByOrganizationIdAndStatus(Long organizationId, ProjectStatus status);

	/**
	 * Count projects by organization and status (for dashboard metrics).
	 */
	Long countByOrganizationIdAndStatus(Long organizationId, ProjectStatus status);

	/**
	 * Check if a project exists within an org (used in validation).
	 */
	boolean existsByIdAndOrganizationId(Long id, Long organizationId);

	@Query("""
			    select p from Project p
			    join p.members m
			    where m.employee.id = :userId
			      and p.organizationId = :organizationId
			""")
	List<Project> findByOrganizationIdAndMember(Long organizationId, Long userId);

	List<Project> findByOrganizationIdAndIsStarredTrue(Long organizationId);

	List<Project> findByOrganizationIdAndTagsIn(Long organizationId, List<String> tags);

	List<Project> findByOrganizationIdAndLastActivityAfter(Long organizationId, LocalDateTime date);

	List<Project> findByOrganizationIdAndProjectType(Long organizationId, ProjectType type);

	List<Project> findByOrganizationIdAndStatusIn(Long organizationId, List<ProjectStatus> statusList);

	Long countByOrganizationIdAndProjectType(Long organizationId, ProjectType type);

	List<Project> findByOrganizationIdAndStartDateBetween(Long organizationId, LocalDate start, LocalDate end);

	List<Project> findByOrganizationIdAndTagsIn(Long organizationId, Set<String> tags);

	@Query("""
			    select p from Project p
			    join p.members m
			    where p.organizationId = :orgId and m.employee.id = :userId and m.activeMember = true
			""")
	List<Project> findProjectsForMember(Long orgId, Long userId);

	List<Project> findByOrganizationIdAndCreatedBy(Long organizationId, Long userId);

	/**
	 * Find all active projects for an organization (for admin dashboard)
	 */
	List<Project> findByOrganizationIdAndActiveTrue(Long organizationId);

}
