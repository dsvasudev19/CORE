package com.dev.core.repository.performance;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.core.constants.ReviewStatus;
import com.dev.core.domain.performance.PerformanceReviewRequest;

@Repository
public interface PerformanceReviewRequestRepository extends JpaRepository<PerformanceReviewRequest, Long> {

    List<PerformanceReviewRequest> findByReviewerId(Long reviewerId);

    List<PerformanceReviewRequest> findByReviewerIdAndStatus(Long reviewerId, ReviewStatus status);

    List<PerformanceReviewRequest> findByEmployeeId(Long employeeId);

    List<PerformanceReviewRequest> findByCycleId(Long cycleId);

    boolean existsByCycleIdAndReviewerIdAndEmployeeId(Long cycleId, Long reviewerId, Long employeeId);
}
