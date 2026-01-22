package com.dev.core.service.performance.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.ReviewStatus;
import com.dev.core.domain.performance.PerformanceReview;
import com.dev.core.domain.performance.PerformanceReviewRequest;
import com.dev.core.mapper.performance.PerformanceReviewMapper;
import com.dev.core.model.performance.PerformanceReviewDTO;
import com.dev.core.repository.performance.PerformanceReviewRepository;
import com.dev.core.repository.performance.PerformanceReviewRequestRepository;
import com.dev.core.service.NotificationService;
import com.dev.core.service.performance.PerformanceReviewService;
import com.dev.core.service.validation.performance.PerformanceReviewValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceReviewServiceImpl implements PerformanceReviewService {

    private final PerformanceReviewRepository reviewRepo;
    private final PerformanceReviewRequestRepository requestRepo;
    private final PerformanceReviewValidator validator;
    private final NotificationService notificationService;

    @Override
    public PerformanceReviewDTO submitReview(Long requestId, PerformanceReviewDTO dto) {
        // Validate
        Long reviewerId = dto.getRequest() != null ? dto.getRequest().getReviewerId() : null;
        // But to be safe, determine reviewerId from request entity in validator
        validator.validateBeforeSubmit(requestId, reviewerId, dto);

        PerformanceReviewRequest req = requestRepo.findById(requestId).orElseThrow();

        // build entity using mapper helper
        PerformanceReview pr = PerformanceReviewMapper.fromRequestAndDTO(req, dto);
        pr.setCreatedAt(LocalDateTime.now());

        pr = reviewRepo.save(pr);

        // update request
        req.setStatus(ReviewStatus.COMPLETED);
        req.setSubmittedAt(LocalDateTime.now());
        requestRepo.save(req);

        // notify reviewer (optional)
        try {
            String to = req.getReviewer() != null ? req.getReviewer().getEmail() : null;
            if (to != null && !to.isBlank()) {
                notificationService.sendEmail(to, "Performance Review Submitted",
                        "Your review for " + req.getEmployee().getFullName() + " has been recorded.");
            }
        } catch (Exception ex) {
            notificationService.handleNotificationFailure(req.getReviewer() != null ? req.getReviewer().getEmail() : "unknown", "submit-review", ex);
        }

        return PerformanceReviewMapper.toDTO(pr);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerformanceReviewDTO> getReviewsForEmployee(Long employeeId) {
        return reviewRepo.findByRequestEmployeeId(employeeId)
                .stream()
                .map(PerformanceReviewMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerformanceReviewDTO> getReviewsForCycle(Long cycleId) {
        return reviewRepo.findByRequestCycleId(cycleId)
                .stream()
                .map(PerformanceReviewMapper::toDTO)
                .toList();
    }
}
