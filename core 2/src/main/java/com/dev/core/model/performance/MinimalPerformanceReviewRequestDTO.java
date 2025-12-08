package com.dev.core.model.performance;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class MinimalPerformanceReviewRequestDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long reviewerId;
    private String reviewerName;
    private String type;
    private String status;
}
