package com.dev.core.service;

import com.dev.core.model.JobPostingDTO;

import java.util.List;

public interface JobPostingService {
    JobPostingDTO createJobPosting(JobPostingDTO dto);
    JobPostingDTO updateJobPosting(Long id, JobPostingDTO dto);
    void deleteJobPosting(Long id);
    JobPostingDTO getJobPostingById(Long id);
    List<JobPostingDTO> getAllJobPostings(Long organizationId);
    List<JobPostingDTO> getActiveJobPostings(Long organizationId);
    List<JobPostingDTO> getJobPostingsByDepartment(Long departmentId);
    JobPostingDTO publishJobPosting(Long id);
    JobPostingDTO closeJobPosting(Long id);
}
