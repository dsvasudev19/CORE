package com.dev.core.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dev.core.model.CandidateDTO;
import com.dev.core.service.CandidateService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping
    public ResponseEntity<CandidateDTO> createCandidate(@RequestBody CandidateDTO dto) {
        CandidateDTO created = candidateService.createCandidate(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> updateCandidate(@PathVariable Long id, @RequestBody CandidateDTO dto) {
        CandidateDTO updated = candidateService.updateCandidate(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> getCandidateById(@PathVariable Long id) {
        CandidateDTO candidate = candidateService.getCandidateById(id);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<List<CandidateDTO>> getAllCandidates(@RequestParam Long organizationId) {
        List<CandidateDTO> candidates = candidateService.getAllCandidates(organizationId);
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/job/{jobPostingId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<List<CandidateDTO>> getCandidatesByJobPosting(@PathVariable Long jobPostingId) {
        List<CandidateDTO> candidates = candidateService.getCandidatesByJobPosting(jobPostingId);
        return ResponseEntity.ok(candidates);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> changeStatus(@PathVariable Long id, @RequestParam String status) {
        CandidateDTO candidate = candidateService.changeStatus(id, status);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}/stage")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> changeStage(@PathVariable Long id, @RequestParam String stage) {
        CandidateDTO candidate = candidateService.changeStage(id, stage);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}/schedule-interview")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> scheduleInterview(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate interviewDate) {
        CandidateDTO candidate = candidateService.scheduleInterview(id, interviewDate);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}/rate")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> rateCandidate(@PathVariable Long id, @RequestParam Double rating) {
        CandidateDTO candidate = candidateService.rateCandidate(id, rating);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}/shortlist")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> shortlistCandidate(@PathVariable Long id) {
        CandidateDTO candidate = candidateService.shortlistCandidate(id);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> rejectCandidate(@PathVariable Long id) {
        CandidateDTO candidate = candidateService.rejectCandidate(id);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}/hire")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<CandidateDTO> hireCandidate(@PathVariable Long id) {
        CandidateDTO candidate = candidateService.hireCandidate(id);
        return ResponseEntity.ok(candidate);
    }
}
