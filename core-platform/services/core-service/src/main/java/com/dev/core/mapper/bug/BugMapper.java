package com.dev.core.mapper.bug;

import com.dev.core.domain.Bug;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.domain.minimal.MinimalProject;
import com.dev.core.domain.minimal.MinimalTask;
import com.dev.core.mapper.ProjectMapper;
import com.dev.core.mapper.options.BugMapperOptions;
import com.dev.core.mapper.task.TaskMapper;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.bug.*;

import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class BugMapper {

	private final TaskMapper taskmapper;

	// ---------------------------------------
	// TO DTO
	// ---------------------------------------
	public BugDTO toDTO(Bug entity) {
		return toDTO(entity, BugMapperOptions.builder().build());
	}

	public BugDTO toDTO(Bug entity, BugMapperOptions options) {
		if (entity == null)
			return null;
		if (options == null)
			options = BugMapperOptions.builder().build();

		BugDTO.BugDTOBuilder<?, ?> builder = BugDTO.builder().id(entity.getId())
				.organizationId(entity.getOrganizationId()).active(entity.getActive()).createdAt(entity.getCreatedAt())
				.updatedAt(entity.getUpdatedAt()).title(entity.getTitle()).description(entity.getDescription())
				.status(entity.getStatus()).severity(entity.getSeverity()).environment(entity.getEnvironment())
				.appVersion(entity.getAppVersion()).reportedBy(toMinimalEmployeeDTO(entity.getReportedBy()))
				.assignedTo(toMinimalEmployeeDTO(entity.getAssignedTo()))
				.verifiedBy(toMinimalEmployeeDTO(entity.getVerifiedBy())).dueDate(entity.getDueDate())
				.resolvedAt(entity.getResolvedAt()).closedAt(entity.getClosedAt()).reopenCount(entity.getReopenCount())
				.commitReference(entity.getCommitReference());

		// Optional Minimal Project
		if (options.isIncludeProject() && entity.getProject() != null)
			builder.project(toMinimalProjectDTO(entity.getProject()));

		// Optional Minimal Task
		if (options.isIncludeLinkedTask() && entity.getLinkedTask() != null)
			builder.linkedTask(toMinimalTaskDTO(entity.getLinkedTask()));

		// Comments
		if (options.isIncludeComments() && entity.getComments() != null)
			builder.comments(entity.getComments().stream().map(c -> BugCommentMapper.toDTO(c, true))
					.collect(Collectors.toSet()));

		// Attachments
		if (options.isIncludeAttachments() && entity.getAttachments() != null)
			builder.attachments(
					entity.getAttachments().stream().map(BugAttachmentMapper::toDTO).collect(Collectors.toSet()));

		// History
		if (options.isIncludeHistory() && entity.getHistoryEntries() != null)
			builder.historyEntries(
					entity.getHistoryEntries().stream().map(BugHistoryMapper::toDTO).collect(Collectors.toList()));

		return builder.build();
	}

	// ---------------------------------------
	// TO ENTITY
	// ---------------------------------------
	public Bug toEntity(BugDTO dto) {
		if (dto == null)
			return null;

		Bug entity = new Bug();
		entity.setId(dto.getId());
		entity.setOrganizationId(dto.getOrganizationId());
		entity.setActive(dto.getActive());
		entity.setTitle(dto.getTitle());
		entity.setDescription(dto.getDescription());
		entity.setStatus(dto.getStatus());
		entity.setSeverity(dto.getSeverity());
		entity.setEnvironment(dto.getEnvironment());
		entity.setAppVersion(dto.getAppVersion());

		// MinimalEmployeeDTO → Employee stub
		entity.setReportedBy(toEmployeeEntity(dto.getReportedBy()));
		entity.setAssignedTo(toEmployeeEntity(dto.getAssignedTo()));
		entity.setVerifiedBy(toEmployeeEntity(dto.getVerifiedBy()));

		entity.setDueDate(dto.getDueDate());
		entity.setResolvedAt(dto.getResolvedAt());
		entity.setClosedAt(dto.getClosedAt());
		entity.setReopenCount(dto.getReopenCount());
		entity.setCommitReference(dto.getCommitReference());

		return entity;
	}

	// ---------------------------------------
	// MINIMAL MAPPING HELPERS
	// ---------------------------------------
	public MinimalEmployeeDTO toMinimalEmployeeDTO(Employee e) {
		if (e == null)
			return null;

		return MinimalEmployeeDTO.builder().id(e.getId()).firstName(e.getFirstName()).lastName(e.getLastName())
				.email(e.getEmail()).build();
	}

	public MinimalProject toMinimalProjectDTO(Project project) {
		if (project == null)
			return null;

		return MinimalProject.builder()

				.name(project.getName()).code(project.getCode()).build();
	}

	public MinimalTask toMinimalTaskDTO(Task task) {
		if (task == null)
			return null;

		return MinimalTask.builder().title(task.getTitle()).description(task.getDescription()).id(task.getId()).build();
	}

	public Employee toEmployeeEntity(MinimalEmployeeDTO dto) {
		if (dto == null || dto.getId() == null)
			return null;

		Employee stub = new Employee();
		stub.setId(dto.getId()); // Only ID, no DB hit
		return stub;
	}
}
