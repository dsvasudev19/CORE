package com.dev.core.model.performance;

import java.time.LocalDateTime;

import com.dev.core.model.BaseDTO;
import com.dev.core.model.MinimalEmployeeDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class PerformanceReviewRequestDTO extends BaseDTO {
    private Long cycleId;
    private PerformanceCycleDTO cycle;

    private Long reviewerId;
    private MinimalEmployeeDTO reviewer;

    private Long employeeId;
    private MinimalEmployeeDTO employee;

    private String type; // MANAGER / PEER
    private String status;
    private LocalDateTime submittedAt;
    private String note;
}
