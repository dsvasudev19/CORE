package com.dev.core.model.performance;

import lombok.*;
import lombok.experimental.SuperBuilder;

import com.dev.core.model.BaseDTO;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class PerformanceReviewDTO extends BaseDTO {
    private Long requestId;
    private PerformanceReviewRequestDTO request;

    private Integer rating;
    private String strengths;
    private String improvements;
    private String comments;
    private String nextQuarterGoals;
}
