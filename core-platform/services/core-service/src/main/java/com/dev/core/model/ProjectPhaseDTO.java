package com.dev.core.model;

import com.dev.core.constants.ProjectStatus;
import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProjectPhaseDTO extends BaseDTO {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Phase name is required")
    @Size(max = 200)
    private String name;

    @Size(max = 2000)
    private String description;

    @NotNull
    private ProjectStatus status;

    private LocalDate startDate;
    private LocalDate endDate;

    @Min(0)
    @Max(100)
    private Integer progressPercentage;

    private Integer orderIndex;
}
