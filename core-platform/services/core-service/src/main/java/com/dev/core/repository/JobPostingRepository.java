package com.dev.core.repository;

import com.dev.core.domain.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByOrganizationId(Long organizationId);
    List<JobPosting> findByOrganizationIdAndStatus(Long organizationId, JobPosting.JobStatus status);
    List<JobPosting> findByDepartmentId(Long departmentId);
}
