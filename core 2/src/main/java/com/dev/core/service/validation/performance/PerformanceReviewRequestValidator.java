package com.dev.core.service.validation.performance;


import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.performance.PerformanceReviewRequestRepository;

@Component
@RequiredArgsConstructor
public class PerformanceReviewRequestValidator {

    private final PerformanceReviewRequestRepository requestRepository;

    public void validateRequestExists(Long requestId) {
        if (requestId == null)
            throw new ValidationFailedException("error.performance.reviewrequest.id.required", null);

        if (!requestRepository.existsById(requestId))
            throw new ValidationFailedException("error.performance.reviewrequest.notfound",
                    new Object[]{requestId});
    }

    public void validateNotSubmitted(Long requestId) {
        requestRepository.findById(requestId).ifPresent(req -> {
            if (req.getStatus() != null &&
                req.getStatus().name().equalsIgnoreCase("COMPLETED")) {

                throw new ValidationFailedException("error.performance.reviewrequest.completed",
                        new Object[]{requestId});
            }
        });
    }

    public void validateReviewerNotEmployee(Long reviewerId, Long employeeId) {
        if (reviewerId != null && employeeId != null && reviewerId.equals(employeeId))
            throw new ValidationFailedException("error.performance.review.self.not.allowed", null);
    }
}
