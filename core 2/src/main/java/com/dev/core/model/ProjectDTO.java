package com.dev.core.model;

import com.dev.core.constants.ProjectStatus;
import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProjectDTO extends BaseDTO {

    @NotBlank(message = "Project name is required")
    @Size(max = 200)
    private String name;

    @Size(max = 100)
    private String code;

    @Size(max = 2000)
    private String description;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    private ProjectStatus status;

    @PastOrPresent(message = "Start date cannot be in the future")
    private LocalDate startDate;

    private LocalDate endDate;

    private LocalDate expectedDeliveryDate;

    private LocalDate actualDeliveryDate;

    @Min(value = 0)
    @Max(value = 100)
    private Integer progressPercentage;

    // Nested info (for response)
    private List<ProjectPhaseDTO> phases;

    private List<ProjectFileDTO> files;
}
