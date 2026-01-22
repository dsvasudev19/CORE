package com.dev.core.domain.minimal;

import java.time.LocalDate;

import com.dev.core.constants.ProjectStatus;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MinimalProjectPhase {
	private long projectId;
	
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
