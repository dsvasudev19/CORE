package com.dev.core.controller.performance;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.dev.core.model.performance.PerformanceReviewDTO;
import com.dev.core.service.performance.PerformanceReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/performance/reviews")
@RequiredArgsConstructor
public class PerformanceReviewController {

    private final PerformanceReviewService reviewService;

    // Reviewer submits a review
    @PostMapping("/{requestId}/submit")
    public PerformanceReviewDTO submitReview(
            @PathVariable Long requestId,
            @RequestBody PerformanceReviewDTO dto) {
        return reviewService.submitReview(requestId, dto);
    }

    // All reviews for an employee
    @GetMapping("/employee/{employeeId}")
    public List<PerformanceReviewDTO> getEmployeeReviews(@PathVariable Long employeeId) {
        return reviewService.getReviewsForEmployee(employeeId);
    }

    // All reviews for a cycle
    @GetMapping("/cycle/{cycleId}")
    public List<PerformanceReviewDTO> getCycleReviews(@PathVariable Long cycleId) {
        return reviewService.getReviewsForCycle(cycleId);
    }
}
