package com.dev.core.model;

import com.dev.core.domain.Sprint;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.Set;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SprintDTO extends BaseDTO {

    private String name;
    private String goal;
    private Sprint.SprintStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long projectId;
    private Set<IssueDTO> issues;
}
