package com.dev.core.model.performance;

import java.time.LocalDateTime;

import com.dev.core.model.BaseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class PerformanceCycleDTO extends BaseDTO {
    private Integer year;
    private Integer quarter;
    private Boolean active;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
}
