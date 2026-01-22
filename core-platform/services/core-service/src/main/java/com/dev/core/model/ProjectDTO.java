package com.dev.core.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.dev.core.constants.ProjectPriority;
import com.dev.core.constants.ProjectStatus;
import com.dev.core.constants.ProjectType;
import com.dev.core.domain.Client;
import com.dev.core.domain.minimal.MinimalClient;
import com.dev.core.domain.minimal.MinimalProjectPhase;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

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

    // 🔥 Optional — required only when projectType = EXTERNAL
    private Long clientId;
    
    private MinimalClient client;

    @NotNull(message = "Project status is required")
    private ProjectStatus status;

    @NotNull(message = "Project type is required") // INTERNAL or EXTERNAL
    private ProjectType projectType;
    
    @NotNull(message="Project Priority is required")
    private ProjectPriority priority;

    @PastOrPresent(message = "Start date cannot be in the future")
    private LocalDate startDate;

    private LocalDate endDate;

    private LocalDate expectedDeliveryDate;

    private LocalDate actualDeliveryDate;

    @Min(value = 0)
    @Max(value = 100)
    private Integer progressPercentage;
    
    private Double budget;
    private Double spent;

    private String color;
    private Boolean isStarred;
    private LocalDateTime lastActivity;

    private Set<String> tags;

    private List<ProjectMemberDTO> members;


    // Nested info for responses
    private List<MinimalProjectPhase> phases;
    private List<ProjectFileDTO> files;
}
