package com.dev.core.repository;


import com.dev.core.domain.Project;
import com.dev.core.constants.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {

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
}
