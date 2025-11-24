package com.dev.core.mapper;

import com.dev.core.domain.Bug;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.domain.TimeLog;
import com.dev.core.domain.minimal.MinimalBug;
import com.dev.core.domain.minimal.MinimalProject;
import com.dev.core.domain.minimal.MinimalTask;
import com.dev.core.model.TimeLogDTO;

public class TimeLogMapper {

	// ------------------------------------------------------
	// toDTO : MUST USE builder()
	// ------------------------------------------------------
	public static TimeLogDTO toDTO(TimeLog entity) {
		if (entity == null)
			return null;

		return TimeLogDTO.builder().id(entity.getId()).organizationId(entity.getOrganizationId())
				.createdAt(entity.getCreatedAt()).updatedAt(entity.getUpdatedAt()).active(entity.isActive())

				.userId(entity.getUserId()).startTime(entity.getStartTime()).endTime(entity.getEndTime())
				.durationMinutes(entity.getDurationMinutes())

				.projectId(entity.getProject() != null ? entity.getProject().getId() : null)
				.taskId(entity.getTask() != null ? entity.getTask().getId() : null)
				.bugId(entity.getBug() != null ? entity.getBug().getId() : null)
				.bug(entity.getBug() != null ? toMinimalBug(entity.getBug()) : null)
				.task(entity.getTask() != null ? toMinimalTask(entity.getTask()) : null)
				.project(entity.getProject() != null ? toMinimalProject(entity.getProject()) : null)
				.workDate(entity.getWorkDate())

				.note(entity.getNote())

				.build();
	}

	// ------------------------------------------------------
	// toEntity : DO NOT use builder (your rule)
	// ------------------------------------------------------
	public static TimeLog toEntity(TimeLogDTO dto, Project project, Task task, Bug bug) {
		if (dto == null)
			return null;

		TimeLog entity = new TimeLog();
		entity.setId(dto.getId());
		entity.setOrganizationId(dto.getOrganizationId());

		entity.setUserId(dto.getUserId());
		entity.setStartTime(dto.getStartTime());
		entity.setEndTime(dto.getEndTime());
		entity.setDurationMinutes(dto.getDurationMinutes());
		entity.setNote(dto.getNote());
		entity.setActive(dto.isActive());
		entity.setWorkDate(dto.getWorkDate());

		entity.setProject(project);
		entity.setTask(task);
		entity.setBug(bug);

		return entity;
	}

	public static MinimalTask toMinimalTask(Task task) {
		return MinimalTask.builder().id(task.getId()).title(task.getTitle()).description(task.getDescription()).build();
	}

	public static MinimalProject toMinimalProject(Project project) {
		return MinimalProject.builder().id(project.getId()).name(project.getName()).code(project.getCode()).build();
	}

	public static MinimalBug toMinimalBug(Bug bug) {
		return MinimalBug.builder().id(bug.getId()).title(bug.getTitle()).description(bug.getDescription())
				.appVersion(bug.getAppVersion()).dueDate(bug.getDueDate()).build();
	}
}
