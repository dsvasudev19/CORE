package com.dev.core.service.task;

import com.dev.core.model.task.TaskDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {

    /**
     * Create a new task under a project or phase.
     */
    TaskDTO createTask(TaskDTO dto);

    /**
     * Update a task’s details (title, description, priority, etc.).
     */
    TaskDTO updateTask(Long id, TaskDTO dto);

    /**
     * Delete a task and optionally its subtasks.
     */
    void deleteTask(Long id, boolean deleteSubtasks);

    /**
     * Get a single task by ID.
     */
    TaskDTO getTaskById(Long id, boolean includeNested);

    /**
     * Get all tasks under a specific project.
     */
    List<TaskDTO> getTasksByProject(Long projectId);

    /**
     * Search/filter tasks dynamically.
     */
    Page<TaskDTO> searchTasks(Long organizationId, String keyword, Pageable pageable);

    /**
     * Assign task to users (single or multiple).
     */
    TaskDTO assignUsers(Long taskId, List<Long> userIds);

    /**
     * Change task status and trigger automation hooks.
     */
    TaskDTO updateTaskStatus(Long taskId, String newStatus);

    /**
     * Update task priority and notify stakeholders.
     */
    TaskDTO updateTaskPriority(Long taskId, String priority);

    /**
     * Recalculate overall task progress % (based on subtasks).
     */
    void recalculateTaskProgress(Long taskId);

    /**
     * Link dependency (blocker or blocked by).
     */
    void addDependency(Long taskId, Long dependsOnTaskId, String dependencyType);

    /**
     * Remove dependency link.
     */
    void removeDependency(Long taskId, Long dependsOnTaskId);

    /**
     * Get all dependencies for a task.
     */
    List<TaskDTO> getDependencies(Long taskId);

    /**
     * Mark a task as complete (triggers dependent task activation).
     */
    TaskDTO markTaskComplete(Long taskId);

    /**
     * Get tasks assigned to a specific user.
     */
    List<TaskDTO> getTasksByAssignee(Long userId);

    /**
     * Auto-close parent if all subtasks are completed.
     */
    void checkAndAutoCloseParent(Long parentTaskId);
}
