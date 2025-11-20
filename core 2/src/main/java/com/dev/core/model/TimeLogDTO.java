package com.dev.core.model;

import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TimeLogDTO extends BaseDTO {

    private Long userId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Long durationMinutes;

    private Long projectId;
    private Long taskId;
    private Long bugId;

    private LocalDate workDate;

    private String note;

    private boolean active;
}
