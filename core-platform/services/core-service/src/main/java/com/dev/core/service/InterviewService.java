package com.dev.core.service;

import com.dev.core.dto.InterviewDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface InterviewService {
    
    InterviewDTO createInterview(InterviewDTO interviewDTO);
    
    InterviewDTO updateInterview(Long id, InterviewDTO interviewDTO);
    
    void deleteInterview(Long id);
    
    InterviewDTO getInterviewById(Long id);
    
    List<InterviewDTO> getAllInterviews(Long organizationId);
    
    List<InterviewDTO> getInterviewsByCandidate(Long candidateId);
    
    List<InterviewDTO> getInterviewsByInterviewer(Long interviewerId);
    
    List<InterviewDTO> getInterviewsByStatus(Long organizationId, String status);
    
    List<InterviewDTO> getInterviewsByDateRange(Long organizationId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<InterviewDTO> getInterviewerSchedule(Long interviewerId, LocalDateTime startDate, LocalDateTime endDate);
    
    InterviewDTO updateInterviewStatus(Long id, String status);
    
    InterviewDTO completeInterview(Long id, String feedback, Double rating, String result);
    
    InterviewDTO rescheduleInterview(Long id, LocalDateTime newDateTime);
}
