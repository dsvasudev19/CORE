package com.dev.core.controller.task;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.task.TaskDependencyDTO;
import com.dev.core.service.task.TaskDependencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/dependent")
@RequiredArgsConstructor
@Slf4j
public class TaskDependencyController {

	private final TaskDependencyService dependencyService;
	private final ControllerHelper helper;

	// --------------------------------------------------------------
	// CREATE DEPENDENCY
	// --------------------------------------------------------------
	@PostMapping
	public ResponseEntity<?> create(@PathVariable Long taskId, @RequestBody TaskDependencyDTO dto) {
		dto.setTaskId(taskId); // Ensure context consistency
		TaskDependencyDTO saved = dependencyService.createDependency(dto);
		return helper.success("Dependency created successfully", saved);
	}

	// --------------------------------------------------------------
	// DELETE DEPENDENCY
	// --------------------------------------------------------------
	@DeleteMapping("/{dependencyId}")
	public ResponseEntity<?> delete(@PathVariable Long taskId, @PathVariable Long dependencyId) {
		dependencyService.deleteDependency(dependencyId);
		return helper.success("Dependency deleted successfully");
	}

	// --------------------------------------------------------------
	// GET DEPENDENCIES (Tasks this task depends on)
	// --------------------------------------------------------------
	@GetMapping
	public ResponseEntity<?> getDependenciesByTask(@PathVariable Long taskId) {
		List<TaskDependencyDTO> list = dependencyService.getDependenciesByTask(taskId);
		return helper.success("Dependencies fetched successfully", list);
	}

	// --------------------------------------------------------------
	// GET DEPENDENTS (Tasks that depend on this one)
	// --------------------------------------------------------------
	@GetMapping("/dependents")
	public ResponseEntity<?> getDependents(@PathVariable Long taskId) {
		List<TaskDependencyDTO> list = dependencyService.getDependents(taskId);
		return helper.success("Dependents fetched successfully", list);
	}

	// --------------------------------------------------------------
	// CHECK IF TASK HAS UNRESOLVED DEPENDENCIES
	// --------------------------------------------------------------
	@GetMapping("/unresolved")
	public ResponseEntity<?> hasUnresolvedDependencies(@PathVariable Long taskId) {
		boolean unresolved = dependencyService.hasUnresolvedDependencies(taskId);
		return helper.success("Dependency resolution check complete",
				unresolved ? "Task has unresolved dependencies" : "All dependencies resolved");
	}
}
