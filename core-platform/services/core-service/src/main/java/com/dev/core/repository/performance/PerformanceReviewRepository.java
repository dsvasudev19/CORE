package com.dev.core.repository.performance;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.performance.PerformanceReview;

@Repository
public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {

    Optional<PerformanceReview> findByRequestId(Long requestId);

    List<PerformanceReview> findByRequestEmployeeId(Long employeeId);

    List<PerformanceReview> findByRequestCycleId(Long cycleId);
}
