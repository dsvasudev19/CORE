package com.dev.core.service.performance.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.performance.PerformanceReview;
import com.dev.core.model.performance.PerformanceReviewDTO;
import com.dev.core.repository.performance.PerformanceReviewRepository;
import com.dev.core.repository.performance.PerformanceReviewRequestRepository;
import com.dev.core.service.performance.PerformanceAnalyticsService;
import com.dev.core.mapper.performance.PerformanceReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PerformanceAnalyticsServiceImpl implements PerformanceAnalyticsService {

    private final PerformanceReviewRepository reviewRepo;
    private final PerformanceReviewRequestRepository requestRepo;

    // -----------------------------------------------
    // EMPLOYEE SUMMARY
    // -----------------------------------------------
    @Override
    public Map<String, Object> getEmployeeSummary(Long employeeId) {

        Map<String, Object> summary = new HashMap<>();

        List<PerformanceReview> reviews = reviewRepo.findByRequestEmployeeId(employeeId);

        int total = reviews.size();
        double avg = reviews.stream()
                .mapToInt(r -> r.getRating() != null ? r.getRating() : 0)
                .average()
                .orElse(0.0);

        summary.put("employeeId", employeeId);
        summary.put("totalReviews", total);
        summary.put("averageRating", avg);
        summary.put("latestReviews", 
            reviews.stream()
                   .limit(5)
                   .map(PerformanceReviewMapper::toDTO)
                   .toList()
        );

        return summary;
    }

    // -----------------------------------------------
    // DEPARTMENT SUMMARY (simple aggregated view)
    // -----------------------------------------------
    @Override
    public Map<String, Object> getDepartmentSummary(Long departmentId) {
        Map<String, Object> summary = new HashMap<>();

        // Fetch all review requests for employees in this department
        List<PerformanceReview> reviews =
                reviewRepo.findAll().stream()
                        .filter(r -> r.getRequest().getEmployee().getDepartment() != null &&
                                departmentId.equals(r.getRequest().getEmployee().getDepartment().getId()))
                        .toList();

        int total = reviews.size();
        double avg = reviews.stream()
                .mapToInt(r -> r.getRating() != null ? r.getRating() : 0)
                .average()
                .orElse(0.0);

        summary.put("departmentId", departmentId);
        summary.put("totalReviews", total);
        summary.put("averageRating", avg);

        return summary;
    }

    // -----------------------------------------------
    // CYCLE SUMMARY
    // -----------------------------------------------
    @Override
    public Map<String, Object> getCycleSummary(Long cycleId) {
        Map<String, Object> summary = new HashMap<>();

        List<PerformanceReview> reviews = reviewRepo.findByRequestCycleId(cycleId);

        int total = reviews.size();
        double avg = reviews.stream()
                .mapToInt(r -> r.getRating() != null ? r.getRating() : 0)
                .average()
                .orElse(0.0);

        long pending = requestRepo.findByCycleId(cycleId).stream()
                .filter(r -> r.getStatus().name().equals("PENDING"))
                .count();

        summary.put("cycleId", cycleId);
        summary.put("totalReviewsCompleted", total);
        summary.put("averageRating", avg);
        summary.put("pendingReviews", pending);

        return summary;
    }
}
