package com.dev.core.service.performance.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.ReviewStatus;
import com.dev.core.mapper.performance.PerformanceReviewRequestMapper;
import com.dev.core.model.performance.MinimalPerformanceReviewRequestDTO;
import com.dev.core.model.performance.PerformanceReviewRequestDTO;
import com.dev.core.repository.performance.PerformanceReviewRequestRepository;
import com.dev.core.service.performance.PerformanceReviewRequestService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PerformanceReviewRequestServiceImpl implements PerformanceReviewRequestService {

    private final PerformanceReviewRequestRepository requestRepo;

    @Override
    public PerformanceReviewRequestDTO getById(Long id) {
        return requestRepo.findById(id).map(PerformanceReviewRequestMapper::toDTO).orElse(null);
    }

    @Override
    public List<PerformanceReviewRequestDTO> getPendingByReviewer(Long reviewerId) {
        return requestRepo.findByReviewerIdAndStatus(reviewerId, ReviewStatus.PENDING)
                .stream().map(PerformanceReviewRequestMapper::toDTO).toList();
    }

    @Override
    public List<MinimalPerformanceReviewRequestDTO> getPendingMinimalByReviewer(Long reviewerId) {
        return requestRepo.findByReviewerIdAndStatus(reviewerId, ReviewStatus.PENDING)
                .stream().map(PerformanceReviewRequestMapper::toMinimal).toList();
    }

    @Override
    public List<PerformanceReviewRequestDTO> getEmployeeReviewRequests(Long employeeId) {
        return requestRepo.findByEmployeeId(employeeId)
                .stream().map(PerformanceReviewRequestMapper::toDTO).toList();
    }
}
