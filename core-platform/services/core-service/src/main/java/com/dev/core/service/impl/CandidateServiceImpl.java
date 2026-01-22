package com.dev.core.service.impl;

import com.dev.core.domain.Candidate;
import com.dev.core.domain.JobPosting;
import com.dev.core.mapper.CandidateMapper;
import com.dev.core.model.CandidateDTO;
import com.dev.core.repository.CandidateRepository;
import com.dev.core.repository.JobPostingRepository;
import com.dev.core.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;
    private final JobPostingRepository jobPostingRepository;

    @Override
    public CandidateDTO createCandidate(CandidateDTO dto) {
        Candidate candidate = CandidateMapper.toEntity(dto);
        
        if (dto.getJobPostingId() != null) {
            JobPosting jobPosting = jobPostingRepository.findById(dto.getJobPostingId())
                    .orElseThrow(() -> new RuntimeException("Job posting not found"));
            candidate.setJobPosting(jobPosting);
        }
        
        if (candidate.getStatus() == null) {
            candidate.setStatus(Candidate.CandidateStatus.NEW);
        }
        
        if (candidate.getAppliedDate() == null) {
            candidate.setAppliedDate(LocalDate.now());
        }
        
        Candidate saved = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(saved);
    }

    @Override
    public CandidateDTO updateCandidate(Long id, CandidateDTO dto) {
        Candidate existing = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setResumeUrl(dto.getResumeUrl());
        existing.setCoverLetterUrl(dto.getCoverLetterUrl());
        existing.setLinkedinUrl(dto.getLinkedinUrl());
        existing.setPortfolioUrl(dto.getPortfolioUrl());
        existing.setExperience(dto.getExperience());
        existing.setEducation(dto.getEducation());
        existing.setCurrentCompany(dto.getCurrentCompany());
        existing.setCurrentPosition(dto.getCurrentPosition());
        existing.setStatus(dto.getStatus());
        existing.setStage(dto.getStage());
        existing.setInterviewDate(dto.getInterviewDate());
        existing.setRating(dto.getRating());
        existing.setNotes(dto.getNotes());
        
        Candidate updated = candidateRepository.save(existing);
        return CandidateMapper.toDTO(updated);
    }

    @Override
    public void deleteCandidate(Long id) {
        candidateRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateDTO getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return CandidateMapper.toDTO(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateDTO> getAllCandidates(Long organizationId) {
        return candidateRepository.findByOrganizationId(organizationId).stream()
                .map(CandidateMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateDTO> getCandidatesByJobPosting(Long jobPostingId) {
        return candidateRepository.findByJobPostingId(jobPostingId).stream()
                .map(CandidateMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CandidateDTO changeStatus(Long id, String status) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setStatus(Candidate.CandidateStatus.valueOf(status));
        Candidate updated = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(updated);
    }

    @Override
    public CandidateDTO changeStage(Long id, String stage) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setStage(Candidate.CandidateStage.valueOf(stage));
        Candidate updated = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(updated);
    }

    @Override
    public CandidateDTO scheduleInterview(Long id, LocalDate interviewDate) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setInterviewDate(interviewDate);
        candidate.setStatus(Candidate.CandidateStatus.INTERVIEW_SCHEDULED);
        Candidate updated = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(updated);
    }

    @Override
    public CandidateDTO rateCandidate(Long id, Double rating) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setRating(rating);
        Candidate updated = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(updated);
    }

    @Override
    public CandidateDTO shortlistCandidate(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setStatus(Candidate.CandidateStatus.SHORTLISTED);
        Candidate updated = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(updated);
    }

    @Override
    public CandidateDTO rejectCandidate(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setStatus(Candidate.CandidateStatus.REJECTED);
        Candidate updated = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(updated);
    }

    @Override
    public CandidateDTO hireCandidate(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setStatus(Candidate.CandidateStatus.HIRED);
        Candidate updated = candidateRepository.save(candidate);
        return CandidateMapper.toDTO(updated);
    }
}
