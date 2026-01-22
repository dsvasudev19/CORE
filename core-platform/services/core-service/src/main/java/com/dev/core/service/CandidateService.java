package com.dev.core.service;

import com.dev.core.model.CandidateDTO;

import java.time.LocalDate;
import java.util.List;

public interface CandidateService {
    CandidateDTO createCandidate(CandidateDTO dto);
    CandidateDTO updateCandidate(Long id, CandidateDTO dto);
    void deleteCandidate(Long id);
    CandidateDTO getCandidateById(Long id);
    List<CandidateDTO> getAllCandidates(Long organizationId);
    List<CandidateDTO> getCandidatesByJobPosting(Long jobPostingId);
    CandidateDTO changeStatus(Long id, String status);
    CandidateDTO changeStage(Long id, String stage);
    CandidateDTO scheduleInterview(Long id, LocalDate interviewDate);
    CandidateDTO rateCandidate(Long id, Double rating);
    CandidateDTO shortlistCandidate(Long id);
    CandidateDTO rejectCandidate(Long id);
    CandidateDTO hireCandidate(Long id);
}
