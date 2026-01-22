package com.dev.core.repository;

import com.dev.core.domain.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByOrganizationId(Long organizationId);
    List<Candidate> findByJobPostingId(Long jobPostingId);
    List<Candidate> findByStatus(Candidate.CandidateStatus status);
    List<Candidate> findByJobPostingIdAndStatus(Long jobPostingId, Candidate.CandidateStatus status);
}
