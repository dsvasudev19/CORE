package com.dev.core.controller.performance;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.dev.core.model.performance.PerformanceReviewRequestDTO;
import com.dev.core.model.performance.MinimalPerformanceReviewRequestDTO;
import com.dev.core.service.performance.PerformanceReviewRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/performance/review-requests")
@RequiredArgsConstructor
public class PerformanceReviewRequestController {

    private final PerformanceReviewRequestService requestService;

    // Get full request DTO
    @GetMapping("/{requestId}")
    public PerformanceReviewRequestDTO getById(@PathVariable Long requestId) {
        return requestService.getById(requestId);
    }

    // Reviewer pending requests
    @GetMapping("/reviewer/{reviewerId}/pending")
    public List<PerformanceReviewRequestDTO> getPendingByReviewer(@PathVariable Long reviewerId) {
        return requestService.getPendingByReviewer(reviewerId);
    }

    // Reviewer pending minimal
    @GetMapping("/reviewer/{reviewerId}/pending/minimal")
    public List<MinimalPerformanceReviewRequestDTO> getPendingMinimal(@PathVariable Long reviewerId) {
        return requestService.getPendingMinimalByReviewer(reviewerId);
    }

    // Employee assigned review requests (manager + peers for this employee)
    @GetMapping("/employee/{employeeId}")
    public List<PerformanceReviewRequestDTO> getEmployeeRequests(@PathVariable Long employeeId) {
        return requestService.getEmployeeReviewRequests(employeeId);
    }
}
