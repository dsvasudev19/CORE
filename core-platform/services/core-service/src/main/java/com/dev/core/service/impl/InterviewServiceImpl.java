package com.dev.core.service.impl;

import com.dev.core.domain.Candidate;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Interview;
import com.dev.core.dto.InterviewDTO;
import com.dev.core.exception.ResourceNotFoundException;
import com.dev.core.mapper.InterviewMapper;
import com.dev.core.repository.CandidateRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.InterviewRepository;
import com.dev.core.service.InterviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;
    private final EmployeeRepository employeeRepository;
    private final InterviewMapper interviewMapper;

    @Override
    public InterviewDTO createInterview(InterviewDTO interviewDTO) {
        log.info("Creating interview for candidate ID: {}", interviewDTO.getCandidateId());

        Candidate candidate = candidateRepository.findById(interviewDTO.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + interviewDTO.getCandidateId()));

        Interview interview = interviewMapper.toEntity(interviewDTO);
        interview.setCandidate(candidate);

        if (interviewDTO.getInterviewerId() != null) {
            Employee interviewer = employeeRepository.findById(interviewDTO.getInterviewerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found with id: " + interviewDTO.getInterviewerId()));
            interview.setInterviewer(interviewer);
        }

        // Set default status if not provided
        if (interview.getStatus() == null) {
            interview.setStatus(Interview.InterviewStatus.SCHEDULED);
        }

        Interview savedInterview = interviewRepository.save(interview);

        // Update candidate status
        if (candidate.getStatus() != Candidate.CandidateStatus.INTERVIEW_SCHEDULED) {
            candidate.setStatus(Candidate.CandidateStatus.INTERVIEW_SCHEDULED);
            candidate.setInterviewDate(interviewDTO.getScheduledDateTime().toLocalDate());
            candidateRepository.save(candidate);
        }

        log.info("Interview created successfully with ID: {}", savedInterview.getId());
        return interviewMapper.toDTO(savedInterview);
    }

    @Override
    public InterviewDTO updateInterview(Long id, InterviewDTO interviewDTO) {
        log.info("Updating interview with ID: {}", id);

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));

        interview.setScheduledDateTime(interviewDTO.getScheduledDateTime());
        interview.setDurationMinutes(interviewDTO.getDurationMinutes());
        interview.setType(interviewDTO.getType());
        interview.setMode(interviewDTO.getMode());
        interview.setLocation(interviewDTO.getLocation());
        interview.setMeetingLink(interviewDTO.getMeetingLink());
        interview.setStatus(interviewDTO.getStatus());
        interview.setNotes(interviewDTO.getNotes());

        if (interviewDTO.getInterviewerId() != null) {
            Employee interviewer = employeeRepository.findById(interviewDTO.getInterviewerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found with id: " + interviewDTO.getInterviewerId()));
            interview.setInterviewer(interviewer);
        }

        Interview updatedInterview = interviewRepository.save(interview);
        log.info("Interview updated successfully");
        return interviewMapper.toDTO(updatedInterview);
    }

    @Override
    public void deleteInterview(Long id) {
        log.info("Deleting interview with ID: {}", id);
        
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
        
        interviewRepository.delete(interview);
        log.info("Interview deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewDTO getInterviewById(Long id) {
        log.info("Fetching interview with ID: {}", id);
        
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
        
        return interviewMapper.toDTO(interview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDTO> getAllInterviews(Long organizationId) {
        log.info("Fetching all interviews for organization ID: {}", organizationId);
        
        return interviewRepository.findByOrganizationId(organizationId).stream()
                .map(interviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDTO> getInterviewsByCandidate(Long candidateId) {
        log.info("Fetching interviews for candidate ID: {}", candidateId);
        
        return interviewRepository.findByCandidateId(candidateId).stream()
                .map(interviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDTO> getInterviewsByInterviewer(Long interviewerId) {
        log.info("Fetching interviews for interviewer ID: {}", interviewerId);
        
        return interviewRepository.findByInterviewerId(interviewerId).stream()
                .map(interviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDTO> getInterviewsByStatus(Long organizationId, String status) {
        log.info("Fetching interviews with status: {} for organization ID: {}", status, organizationId);
        
        Interview.InterviewStatus interviewStatus = Interview.InterviewStatus.valueOf(status);
        return interviewRepository.findByOrganizationIdAndStatus(organizationId, interviewStatus).stream()
                .map(interviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDTO> getInterviewsByDateRange(Long organizationId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching interviews between {} and {} for organization ID: {}", startDate, endDate, organizationId);
        
        return interviewRepository.findByOrganizationIdAndDateRange(organizationId, startDate, endDate).stream()
                .map(interviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDTO> getInterviewerSchedule(Long interviewerId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching schedule for interviewer ID: {} between {} and {}", interviewerId, startDate, endDate);
        
        return interviewRepository.findByInterviewerIdAndDateRange(interviewerId, startDate, endDate).stream()
                .map(interviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InterviewDTO updateInterviewStatus(Long id, String status) {
        log.info("Updating interview status to: {} for ID: {}", status, id);
        
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
        
        Interview.InterviewStatus newStatus = Interview.InterviewStatus.valueOf(status);
        interview.setStatus(newStatus);
        
        // Update candidate status based on interview status
        Candidate candidate = interview.getCandidate();
        if (newStatus == Interview.InterviewStatus.COMPLETED && candidate.getStatus() == Candidate.CandidateStatus.INTERVIEW_SCHEDULED) {
            candidate.setStatus(Candidate.CandidateStatus.INTERVIEWED);
            candidateRepository.save(candidate);
        }
        
        Interview updatedInterview = interviewRepository.save(interview);
        log.info("Interview status updated successfully");
        return interviewMapper.toDTO(updatedInterview);
    }

    @Override
    public InterviewDTO completeInterview(Long id, String feedback, Double rating, String result) {
        log.info("Completing interview with ID: {}", id);
        
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
        
        interview.setStatus(Interview.InterviewStatus.COMPLETED);
        interview.setFeedback(feedback);
        interview.setRating(rating);
        interview.setResult(result != null ? Interview.InterviewResult.valueOf(result) : null);
        interview.setCompletedAt(LocalDateTime.now());
        
        // Update candidate status and rating
        Candidate candidate = interview.getCandidate();
        candidate.setStatus(Candidate.CandidateStatus.INTERVIEWED);
        if (rating != null) {
            candidate.setRating(rating);
        }
        candidateRepository.save(candidate);
        
        Interview completedInterview = interviewRepository.save(interview);
        log.info("Interview completed successfully");
        return interviewMapper.toDTO(completedInterview);
    }

    @Override
    public InterviewDTO rescheduleInterview(Long id, LocalDateTime newDateTime) {
        log.info("Rescheduling interview with ID: {} to {}", id, newDateTime);
        
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
        
        interview.setScheduledDateTime(newDateTime);
        interview.setStatus(Interview.InterviewStatus.RESCHEDULED);
        
        // Update candidate interview date
        Candidate candidate = interview.getCandidate();
        candidate.setInterviewDate(newDateTime.toLocalDate());
        candidateRepository.save(candidate);
        
        Interview rescheduledInterview = interviewRepository.save(interview);
        log.info("Interview rescheduled successfully");
        return interviewMapper.toDTO(rescheduledInterview);
    }
}
