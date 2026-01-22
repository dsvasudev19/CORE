package com.dev.core.service.impl;

import com.dev.core.domain.Department;
import com.dev.core.domain.JobPosting;
import com.dev.core.mapper.JobPostingMapper;
import com.dev.core.model.JobPostingDTO;
import com.dev.core.repository.CandidateRepository;
import com.dev.core.repository.DepartmentRepository;
import com.dev.core.repository.JobPostingRepository;
import com.dev.core.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobPostingServiceImpl implements JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final DepartmentRepository departmentRepository;
    private final CandidateRepository candidateRepository;

    @Override
    public JobPostingDTO createJobPosting(JobPostingDTO dto) {
        JobPosting jobPosting = JobPostingMapper.toEntity(dto);
        
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            jobPosting.setDepartment(department);
        }
        
        if (jobPosting.getStatus() == null) {
            jobPosting.setStatus(JobPosting.JobStatus.DRAFT);
        }
        
        if (jobPosting.getPostedDate() == null) {
            jobPosting.setPostedDate(LocalDate.now());
        }
        
        JobPosting saved = jobPostingRepository.save(jobPosting);
        return enrichWithCounts(JobPostingMapper.toDTO(saved));
    }

    @Override
    public JobPostingDTO updateJobPosting(Long id, JobPostingDTO dto) {
        JobPosting existing = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job posting not found"));
        
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setRequirements(dto.getRequirements());
        existing.setResponsibilities(dto.getResponsibilities());
        existing.setLocation(dto.getLocation());
        existing.setType(dto.getType());
        existing.setSalaryRange(dto.getSalaryRange());
        existing.setStatus(dto.getStatus());
        existing.setUrgency(dto.getUrgency());
        existing.setClosingDate(dto.getClosingDate());
        existing.setOpenings(dto.getOpenings());
        
        if (dto.getDepartmentId() != null && !dto.getDepartmentId().equals(
                existing.getDepartment() != null ? existing.getDepartment().getId() : null)) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            existing.setDepartment(department);
        }
        
        JobPosting updated = jobPostingRepository.save(existing);
        return enrichWithCounts(JobPostingMapper.toDTO(updated));
    }

    @Override
    public void deleteJobPosting(Long id) {
        jobPostingRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostingDTO getJobPostingById(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job posting not found"));
        return enrichWithCounts(JobPostingMapper.toDTO(jobPosting));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingDTO> getAllJobPostings(Long organizationId) {
        return jobPostingRepository.findByOrganizationId(organizationId).stream()
                .map(JobPostingMapper::toDTO)
                .map(this::enrichWithCounts)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingDTO> getActiveJobPostings(Long organizationId) {
        return jobPostingRepository.findByOrganizationIdAndStatus(organizationId, JobPosting.JobStatus.ACTIVE).stream()
                .map(JobPostingMapper::toDTO)
                .map(this::enrichWithCounts)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingDTO> getJobPostingsByDepartment(Long departmentId) {
        return jobPostingRepository.findByDepartmentId(departmentId).stream()
                .map(JobPostingMapper::toDTO)
                .map(this::enrichWithCounts)
                .collect(Collectors.toList());
    }

    @Override
    public JobPostingDTO publishJobPosting(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job posting not found"));
        jobPosting.setStatus(JobPosting.JobStatus.ACTIVE);
        jobPosting.setPostedDate(LocalDate.now());
        JobPosting updated = jobPostingRepository.save(jobPosting);
        return enrichWithCounts(JobPostingMapper.toDTO(updated));
    }

    @Override
    public JobPostingDTO closeJobPosting(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job posting not found"));
        jobPosting.setStatus(JobPosting.JobStatus.CLOSED);
        JobPosting updated = jobPostingRepository.save(jobPosting);
        return enrichWithCounts(JobPostingMapper.toDTO(updated));
    }

    private JobPostingDTO enrichWithCounts(JobPostingDTO dto) {
        List<com.dev.core.domain.Candidate> candidates = candidateRepository.findByJobPostingId(dto.getId());
        dto.setApplicantsCount(candidates.size());
        dto.setShortlistedCount((int) candidates.stream()
                .filter(c -> c.getStatus() == com.dev.core.domain.Candidate.CandidateStatus.SHORTLISTED)
                .count());
        dto.setInterviewedCount((int) candidates.stream()
                .filter(c -> c.getStatus() == com.dev.core.domain.Candidate.CandidateStatus.INTERVIEWED ||
                             c.getStatus() == com.dev.core.domain.Candidate.CandidateStatus.INTERVIEW_SCHEDULED)
                .count());
        return dto;
    }
}
