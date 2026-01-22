package com.dev.core.repository;

import com.dev.core.domain.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByOrganizationId(Long organizationId);
    List<Sprint> findByProjectId(Long projectId);
    List<Sprint> findByProjectIdAndStatus(Long projectId, Sprint.SprintStatus status);
}
