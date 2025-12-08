package com.dev.core.service.validation.performance;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.performance.PerformanceCycleRepository;

@Component
@RequiredArgsConstructor
public class PerformanceCycleValidator {

    private final PerformanceCycleRepository cycleRepository;

    public void validateBeforeCreate(Integer year, Integer quarter, Long orgId) {

        if (year == null || year < 2000)
            throw new ValidationFailedException("error.performance.cycle.year.invalid", new Object[]{year});

        if (quarter == null || quarter < 1 || quarter > 4)
            throw new ValidationFailedException("error.performance.cycle.quarter.invalid", new Object[]{quarter});

        boolean exists = cycleRepository
                .findByYearAndQuarterAndOrganizationId(year, quarter, orgId)
                .isPresent();

        if (exists)
            throw new ValidationFailedException("error.performance.cycle.exists",
                    new Object[]{year, quarter});
    }
}
