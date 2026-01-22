package com.dev.core.service.validation.performance;


import org.springframework.stereotype.Component;

import com.dev.core.constants.ReviewStatus;
import com.dev.core.domain.performance.PerformanceReviewRequest;
import com.dev.core.exception.UnauthorizedAccessException;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.performance.PerformanceReviewDTO;
import com.dev.core.repository.performance.PerformanceReviewRepository;
import com.dev.core.repository.performance.PerformanceReviewRequestRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PerformanceReviewValidator {

    private final PerformanceReviewRepository reviewRepo;
    private final PerformanceReviewRequestRepository requestRepo;

    public void validateBeforeSubmit(Long requestId, Long reviewerId, PerformanceReviewDTO dto) {

        // --- Basic checks ---
        if (requestId == null)
            throw new ValidationFailedException("error.performance.reviewrequest.id.required", null);

        PerformanceReviewRequest req = requestRepo.findById(requestId)
                .orElseThrow(() ->
                        new ValidationFailedException("error.performance.reviewrequest.notfound",
                                new Object[]{requestId}));

        // --- Self-review is forbidden ---
        if (req.getEmployee().getId().equals(req.getReviewer().getId()))
            throw new ValidationFailedException("error.performance.review.self.not.allowed", null);

        // --- Reviewer must be the same user assigned to this request ---
        if (!req.getReviewer().getId().equals(reviewerId))
            throw new UnauthorizedAccessException("You are not authorized to submit this review.");

        // --- Request must be pending ---
        if (req.getStatus() == ReviewStatus.COMPLETED)
            throw new ValidationFailedException("error.performance.reviewrequest.completed",
                    new Object[]{requestId});

        // --- Review must not already exist ---
        if (reviewRepo.findByRequestId(requestId).isPresent())
            throw new ValidationFailedException("error.performance.review.already.exists",
                    new Object[]{requestId});

        // --- Rating validation ---
        if (dto.getRating() == null || dto.getRating() < 1 || dto.getRating() > 5)
            throw new ValidationFailedException("error.performance.review.rating.invalid",
                    new Object[]{dto.getRating()});

        // --- Optional long-text validation ---
        if (dto.getStrengths() != null && dto.getStrengths().length() > 2000)
            throw new ValidationFailedException("error.performance.review.strengths.too.long", null);

        if (dto.getImprovements() != null && dto.getImprovements().length() > 2000)
            throw new ValidationFailedException("error.performance.review.improvements.too.long", null);

        if (dto.getComments() != null && dto.getComments().length() > 2000)
            throw new ValidationFailedException("error.performance.review.comments.too.long", null);

        if (dto.getNextQuarterGoals() != null && dto.getNextQuarterGoals().length() > 2000)
            throw new ValidationFailedException("error.performance.review.goals.too.long", null);
    }
}
