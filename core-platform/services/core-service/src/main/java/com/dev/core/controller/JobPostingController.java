package com.dev.core.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dev.core.model.JobPostingDTO;
import com.dev.core.service.JobPostingService;

import java.util.List;

@RestController
@RequestMapping("/api/job-posting")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<JobPostingDTO> createJobPosting(@RequestBody JobPostingDTO dto) {
        JobPostingDTO created = jobPostingService.createJobPosting(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<JobPostingDTO> updateJobPosting(@PathVariable Long id, @RequestBody JobPostingDTO dto) {
        JobPostingDTO updated = jobPostingService.updateJobPosting(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<Void> deleteJobPosting(@PathVariable Long id) {
        jobPostingService.deleteJobPosting(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<JobPostingDTO> getJobPostingById(@PathVariable Long id) {
        JobPostingDTO jobPosting = jobPostingService.getJobPostingById(id);
        return ResponseEntity.ok(jobPosting);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<List<JobPostingDTO>> getAllJobPostings(@RequestParam Long organizationId) {
        List<JobPostingDTO> jobPostings = jobPostingService.getAllJobPostings(organizationId);
        return ResponseEntity.ok(jobPostings);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<List<JobPostingDTO>> getActiveJobPostings(@RequestParam Long organizationId) {
        List<JobPostingDTO> jobPostings = jobPostingService.getActiveJobPostings(organizationId);
        return ResponseEntity.ok(jobPostings);
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<List<JobPostingDTO>> getJobPostingsByDepartment(@PathVariable Long departmentId) {
        List<JobPostingDTO> jobPostings = jobPostingService.getJobPostingsByDepartment(departmentId);
        return ResponseEntity.ok(jobPostings);
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<JobPostingDTO> publishJobPosting(@PathVariable Long id) {
        JobPostingDTO jobPosting = jobPostingService.publishJobPosting(id);
        return ResponseEntity.ok(jobPosting);
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<JobPostingDTO> closeJobPosting(@PathVariable Long id) {
        JobPostingDTO jobPosting = jobPostingService.closeJobPosting(id);
        return ResponseEntity.ok(jobPosting);
    }
}
