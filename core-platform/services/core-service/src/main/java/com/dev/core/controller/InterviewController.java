package com.dev.core.controller;

import com.dev.core.dto.InterviewDTO;
import com.dev.core.service.InterviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<InterviewDTO> createInterview(@RequestBody InterviewDTO interviewDTO) {
        log.info("REST request to create interview for candidate ID: {}", interviewDTO.getCandidateId());
        InterviewDTO result = interviewService.createInterview(interviewDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewDTO> updateInterview(
            @PathVariable Long id,
            @RequestBody InterviewDTO interviewDTO) {
        log.info("REST request to update interview with ID: {}", id);
        InterviewDTO result = interviewService.updateInterview(id, interviewDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        log.info("REST request to delete interview with ID: {}", id);
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewDTO> getInterviewById(@PathVariable Long id) {
        log.info("REST request to get interview with ID: {}", id);
        InterviewDTO result = interviewService.getInterviewById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<InterviewDTO>> getAllInterviews(
            @RequestParam Long organizationId) {
        log.info("REST request to get all interviews for organization ID: {}", organizationId);
        List<InterviewDTO> result = interviewService.getAllInterviews(organizationId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByCandidate(
            @PathVariable Long candidateId) {
        log.info("REST request to get interviews for candidate ID: {}", candidateId);
        List<InterviewDTO> result = interviewService.getInterviewsByCandidate(candidateId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByInterviewer(
            @PathVariable Long interviewerId) {
        log.info("REST request to get interviews for interviewer ID: {}", interviewerId);
        List<InterviewDTO> result = interviewService.getInterviewsByInterviewer(interviewerId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByStatus(
            @RequestParam Long organizationId,
            @RequestParam String status) {
        log.info("REST request to get interviews with status: {} for organization ID: {}", status, organizationId);
        List<InterviewDTO> result = interviewService.getInterviewsByStatus(organizationId, status);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByDateRange(
            @RequestParam Long organizationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("REST request to get interviews between {} and {} for organization ID: {}", startDate, endDate, organizationId);
        List<InterviewDTO> result = interviewService.getInterviewsByDateRange(organizationId, startDate, endDate);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/interviewer/{interviewerId}/schedule")
    public ResponseEntity<List<InterviewDTO>> getInterviewerSchedule(
            @PathVariable Long interviewerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("REST request to get schedule for interviewer ID: {} between {} and {}", interviewerId, startDate, endDate);
        List<InterviewDTO> result = interviewService.getInterviewerSchedule(interviewerId, startDate, endDate);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InterviewDTO> updateInterviewStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        log.info("REST request to update interview status to: {} for ID: {}", status, id);
        InterviewDTO result = interviewService.updateInterviewStatus(id, status);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<InterviewDTO> completeInterview(
            @PathVariable Long id,
            @RequestParam(required = false) String feedback,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String result) {
        log.info("REST request to complete interview with ID: {}", id);
        InterviewDTO interviewDTO = interviewService.completeInterview(id, feedback, rating, result);
        return ResponseEntity.ok(interviewDTO);
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<InterviewDTO> rescheduleInterview(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDateTime) {
        log.info("REST request to reschedule interview with ID: {} to {}", id, newDateTime);
        InterviewDTO result = interviewService.rescheduleInterview(id, newDateTime);
        return ResponseEntity.ok(result);
    }
}
