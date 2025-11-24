package com.dev.core.domain.minimal;

import java.time.LocalDateTime;

import com.dev.core.constants.BugSeverity;
import com.dev.core.constants.BugStatus;
import com.dev.core.model.MinimalEmployeeDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MinimalBug {
	private Long id;
	private String title;
	private String description;
	private BugStatus status;
	private BugSeverity severity;
	private String environment;
	private String appVersion;

	private MinimalProject project;
	private MinimalTask linkedTask;

	private MinimalEmployeeDTO reportedBy;
	private MinimalEmployeeDTO assignedTo;
	private MinimalEmployeeDTO verifiedBy;

	private LocalDateTime dueDate;
	private LocalDateTime resolvedAt;
	private LocalDateTime closedAt;

	private Integer reopenCount;
	private String commitReference;
}
