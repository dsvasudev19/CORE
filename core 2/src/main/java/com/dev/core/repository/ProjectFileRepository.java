package com.dev.core.repository;


import com.dev.core.domain.ProjectFile;
import com.dev.core.constants.FileVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long>, JpaSpecificationExecutor<ProjectFile> {

    /**
     * Fetch all files linked to a specific project.
     */
    List<ProjectFile> findByProjectId(Long projectId);

    /**
     * Fetch all files for a project filtered by visibility.
     */
    List<ProjectFile> findByProjectIdAndVisibility(Long projectId, FileVisibility visibility);

    /**
     * Check if a file belongs to a project (for security/validation).
     */
    boolean existsByIdAndProjectId(Long id, Long projectId);

    /**
     * Count all project files under an organization.
     */
    Long countByOrganizationId(Long organizationId);
}
