package com.dev.core.dto;

import com.dev.core.domain.Interview;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewDTO {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String jobPostingTitle;
    private Long interviewerId;
    private String interviewerName;
    private LocalDateTime scheduledDateTime;
    private Integer durationMinutes;
    private Interview.InterviewType type;
    private Interview.InterviewMode mode;
    private String location;
    private String meetingLink;
    private Interview.InterviewStatus status;
    private String notes;
    private String feedback;
    private Double rating;
    private Interview.InterviewResult result;
    private LocalDateTime completedAt;
    private Long organizationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
