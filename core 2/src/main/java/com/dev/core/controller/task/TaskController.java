package com.dev.core.controller.task;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.task.TaskDTO;
import com.dev.core.service.task.TaskAutomationService;
import com.dev.core.service.task.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;
    private final TaskAutomationService automationService;
    private final ControllerHelper helper;

    // --------------------------------------------------------------
    // CREATE TASK
    // --------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> create(@RequestBody TaskDTO dto) {
        TaskDTO created = taskService.createTask(dto);
        automationService.onTaskCreated(created.getId());
        return helper.success("Task created successfully", created);
    }

    // --------------------------------------------------------------
    // UPDATE TASK DETAILS
    // --------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TaskDTO dto) {
        TaskDTO updated = taskService.updateTask(id, dto);
        return helper.success("Task updated successfully", updated);
    }

    // --------------------------------------------------------------
    // DELETE TASK (optionally subtasks)
    // --------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @RequestParam(defaultValue = "false") boolean deleteSubtasks) {
        taskService.deleteTask(id, deleteSubtasks);
        return helper.success("Task deleted successfully");
    }

    // --------------------------------------------------------------
    // GET SINGLE TASK
    // --------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id,
                                     @RequestParam(defaultValue = "false") boolean includeNested) {
        TaskDTO dto = taskService.getTaskById(id, includeNested);
        return helper.success("Task fetched successfully", dto);
    }

    // --------------------------------------------------------------
    // LIST BY PROJECT
    // --------------------------------------------------------------
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Long projectId) {
        List<TaskDTO> tasks = taskService.getTasksByProject(projectId);
        return helper.success("Tasks fetched successfully", tasks);
    }

    // --------------------------------------------------------------
    // SEARCH TASKS
    // --------------------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Long organizationId,
                                    @RequestParam(required = false) String keyword,
                                    Pageable pageable) {
        Page<TaskDTO> page = taskService.searchTasks(organizationId, keyword, pageable);
        return helper.success("Tasks search completed", page);
    }

    // --------------------------------------------------------------
    // ASSIGN USERS
    // --------------------------------------------------------------
    @PutMapping("/{taskId}/assign")
    public ResponseEntity<?> assignUsers(@PathVariable Long taskId, @RequestBody List<Long> userIds) {
        TaskDTO updated = taskService.assignUsers(taskId, userIds);
        userIds.forEach(uid -> automationService.onTaskAssigned(taskId, uid));
        return helper.success("Task users assigned successfully", updated);
    }

    // --------------------------------------------------------------
    // UPDATE TASK STATUS
    // --------------------------------------------------------------
    @PutMapping("/{taskId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long taskId, @RequestParam String newStatus) {
        TaskDTO updated = taskService.updateTaskStatus(taskId, newStatus);
        automationService.onTaskStatusChanged(taskId, null, newStatus);
        return helper.success("Task status updated successfully", updated);
    }

    // --------------------------------------------------------------
    // UPDATE PRIORITY
    // --------------------------------------------------------------
    @PutMapping("/{taskId}/priority")
    public ResponseEntity<?> updatePriority(@PathVariable Long taskId, @RequestParam String priority) {
        TaskDTO updated = taskService.updateTaskPriority(taskId, priority);
        automationService.onTaskPriorityChanged(taskId, null, priority);
        return helper.success("Task priority updated successfully", updated);
    }

    // --------------------------------------------------------------
    // RECOMPUTE PROGRESS
    // --------------------------------------------------------------
    @PutMapping("/{taskId}/recalculate-progress")
    public ResponseEntity<?> recalcProgress(@PathVariable Long taskId) {
        taskService.recalculateTaskProgress(taskId);
        return helper.success("Task progress recalculated successfully");
    }

    // --------------------------------------------------------------
    // ADD DEPENDENCY
    // --------------------------------------------------------------
    @PostMapping("/{taskId}/dependencies")
    public ResponseEntity<?> addDependency(@PathVariable Long taskId,
                                           @RequestParam Long dependsOnTaskId,
                                           @RequestParam String dependencyType) {
        taskService.addDependency(taskId, dependsOnTaskId, dependencyType);
        return helper.success("Dependency added successfully");
    }

    // --------------------------------------------------------------
    // REMOVE DEPENDENCY
    // --------------------------------------------------------------
    @DeleteMapping("/{taskId}/dependencies")
    public ResponseEntity<?> removeDependency(@PathVariable Long taskId,
                                              @RequestParam Long dependsOnTaskId) {
        taskService.removeDependency(taskId, dependsOnTaskId);
        return helper.success("Dependency removed successfully");
    }

    // --------------------------------------------------------------
    // GET ALL DEPENDENCIES
    // --------------------------------------------------------------
    @GetMapping("/{taskId}/dependencies")
    public ResponseEntity<?> getDependencies(@PathVariable Long taskId) {
        List<TaskDTO> dependencies = taskService.getDependencies(taskId);
        return helper.success("Dependencies fetched successfully", dependencies);
    }

    // --------------------------------------------------------------
    // MARK COMPLETE
    // --------------------------------------------------------------
    @PutMapping("/{taskId}/complete")
    public ResponseEntity<?> markComplete(@PathVariable Long taskId) {
        TaskDTO dto = taskService.markTaskComplete(taskId);
        automationService.onTaskCompleted(taskId);
        return helper.success("Task marked as complete", dto);
    }

    // --------------------------------------------------------------
    // GET BY ASSIGNEE
    // --------------------------------------------------------------
    @GetMapping("/assignee/{userId}")
    public ResponseEntity<?> getByAssignee(@PathVariable Long userId) {
        List<TaskDTO> tasks = taskService.getTasksByAssignee(userId);
        return helper.success("Tasks fetched successfully for user", tasks);
    }

    // --------------------------------------------------------------
    // CHECK AUTO CLOSE
    // --------------------------------------------------------------
    @PutMapping("/{taskId}/auto-close")
    public ResponseEntity<?> autoClose(@PathVariable Long taskId) {
        taskService.checkAndAutoCloseParent(taskId);
        return helper.success("Auto-close parent task check triggered");
    }
}
