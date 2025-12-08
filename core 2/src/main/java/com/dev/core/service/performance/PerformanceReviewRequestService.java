package com.dev.core.service.performance;

import java.util.List;
import com.dev.core.model.performance.PerformanceReviewRequestDTO;
import com.dev.core.model.performance.MinimalPerformanceReviewRequestDTO;

public interface PerformanceReviewRequestService {

    PerformanceReviewRequestDTO getById(Long id);

    List<PerformanceReviewRequestDTO> getPendingByReviewer(Long reviewerId);

    List<MinimalPerformanceReviewRequestDTO> getPendingMinimalByReviewer(Long reviewerId);

    List<PerformanceReviewRequestDTO> getEmployeeReviewRequests(Long employeeId);

}
