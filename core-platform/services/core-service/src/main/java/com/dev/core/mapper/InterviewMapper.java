package com.dev.core.mapper;

import com.dev.core.domain.Interview;
import com.dev.core.dto.InterviewDTO;
import org.springframework.stereotype.Component;

@Component
public class InterviewMapper {

    public InterviewDTO toDTO(Interview interview) {
        if (interview == null) {
            return null;
        }

        return InterviewDTO.builder()
                .id(interview.getId())
                .candidateId(interview.getCandidate() != null ? interview.getCandidate().getId() : null)
                .candidateName(interview.getCandidate() != null ? 
                    interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName() : null)
                .candidateEmail(interview.getCandidate() != null ? interview.getCandidate().getEmail() : null)
                .jobPostingTitle(interview.getCandidate() != null && interview.getCandidate().getJobPosting() != null ? 
                    interview.getCandidate().getJobPosting().getTitle() : null)
                .interviewerId(interview.getInterviewer() != null ? interview.getInterviewer().getId() : null)
                .interviewerName(interview.getInterviewer() != null ? 
                    interview.getInterviewer().getFirstName() + " " + interview.getInterviewer().getLastName() : null)
                .scheduledDateTime(interview.getScheduledDateTime())
                .durationMinutes(interview.getDurationMinutes())
                .type(interview.getType())
                .mode(interview.getMode())
                .location(interview.getLocation())
                .meetingLink(interview.getMeetingLink())
                .status(interview.getStatus())
                .notes(interview.getNotes())
                .feedback(interview.getFeedback())
                .rating(interview.getRating())
                .result(interview.getResult())
                .completedAt(interview.getCompletedAt())
                .organizationId(interview.getOrganizationId())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }

    public Interview toEntity(InterviewDTO dto) {
        if (dto == null) {
            return null;
        }

        return Interview.builder()
                .scheduledDateTime(dto.getScheduledDateTime())
                .durationMinutes(dto.getDurationMinutes())
                .type(dto.getType())
                .mode(dto.getMode())
                .location(dto.getLocation())
                .meetingLink(dto.getMeetingLink())
                .status(dto.getStatus())
                .notes(dto.getNotes())
                .feedback(dto.getFeedback())
                .rating(dto.getRating())
                .result(dto.getResult())
                .completedAt(dto.getCompletedAt())
                .organizationId(dto.getOrganizationId())
                .build();
    }
}
