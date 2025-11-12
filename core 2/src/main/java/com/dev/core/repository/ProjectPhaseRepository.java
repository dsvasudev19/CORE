package com.dev.core.repository;


import com.dev.core.domain.ProjectPhase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectPhaseRepository extends JpaRepository<ProjectPhase, Long>, JpaSpecificationExecutor<ProjectPhase> {

    /**
     * Fetch all phases under a specific project.
     */
    List<ProjectPhase> findByProjectId(Long projectId);

    /**
     * Fetch all phases ordered by order index.
     */
    List<ProjectPhase> findByProjectIdOrderByOrderIndexAsc(Long projectId);

    /**
     * Count all completed phases for progress calculation.
     */
    Long countByProjectIdAndStatus(Long projectId, com.dev.core.constants.ProjectStatus status);

    /**
     * Check if phase exists under the project (for validation).
     */
    boolean existsByIdAndProjectId(Long id, Long projectId);
}
