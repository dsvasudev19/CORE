package com.dev.core.service.performance;

import java.util.List;
import com.dev.core.model.performance.PerformanceReviewDTO;

public interface PerformanceReviewService {

    PerformanceReviewDTO submitReview(Long requestId, PerformanceReviewDTO dto);

    List<PerformanceReviewDTO> getReviewsForEmployee(Long employeeId);

    List<PerformanceReviewDTO> getReviewsForCycle(Long cycleId);

}
