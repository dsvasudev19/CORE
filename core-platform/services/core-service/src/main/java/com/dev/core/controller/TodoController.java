package com.dev.core.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.core.model.TodoDTO;
import com.dev.core.service.todo.TodoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    // -------------------------------------------------------------------------
    // CRUD
    // -------------------------------------------------------------------------

    @PostMapping
    public ResponseEntity<TodoDTO> create(@RequestBody TodoDTO dto) {
        return ResponseEntity.ok(todoService.createTodo(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDTO> update(@PathVariable Long id, @RequestBody TodoDTO dto) {
        return ResponseEntity.ok(todoService.updateTodo(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    @GetMapping
    public ResponseEntity<List<TodoDTO>> getAll() {
        return ResponseEntity.ok(todoService.getAllTodos());
    }

    // -------------------------------------------------------------------------
    // STATUS MANAGEMENT
    // -------------------------------------------------------------------------

    @PutMapping("/{id}/status/in-progress")
    public ResponseEntity<TodoDTO> markInProgress(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.markInProgress(id));
    }

    @PutMapping("/{id}/status/completed")
    public ResponseEntity<TodoDTO> markCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.markCompleted(id));
    }

    @PutMapping("/{id}/status/blocked")
    public ResponseEntity<TodoDTO> markBlocked(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.markBlocked(id));
    }

    @PutMapping("/{id}/status/cancelled")
    public ResponseEntity<TodoDTO> markCancelled(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.markCancelled(id));
    }

    // -------------------------------------------------------------------------
    // ASSIGNMENT
    // -------------------------------------------------------------------------

    @PutMapping("/{id}/assign/{employeeId}")
    public ResponseEntity<TodoDTO> assignToEmployee(
            @PathVariable Long id,
            @PathVariable Long employeeId
    ) {
        return ResponseEntity.ok(todoService.assignToEmployee(id, employeeId));
    }

    @PutMapping("/{id}/unassign")
    public ResponseEntity<TodoDTO> unassign(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.unassign(id));
    }

    // -------------------------------------------------------------------------
    // PROJECT / TASK LINKING
    // -------------------------------------------------------------------------

    @PutMapping("/{id}/link/project/{projectCode}")
    public ResponseEntity<TodoDTO> linkToProject(
            @PathVariable Long id,
            @PathVariable String projectCode
    ) {
        return ResponseEntity.ok(todoService.linkToProject(id, projectCode));
    }

    @PutMapping("/{id}/unlink/project")
    public ResponseEntity<TodoDTO> unlinkProject(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.unlinkProject(id));
    }

    @PutMapping("/{id}/link/task/{taskId}")
    public ResponseEntity<TodoDTO> linkToTask(
            @PathVariable Long id,
            @PathVariable Long taskId
    ) {
        return ResponseEntity.ok(todoService.linkToTask(id, taskId));
    }

    @PutMapping("/{id}/unlink/task")
    public ResponseEntity<TodoDTO> unlinkTask(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.unlinkTask(id));
    }

    // -------------------------------------------------------------------------
    // FILTERS
    // -------------------------------------------------------------------------

    @GetMapping("/assignee/{employeeId}")
    public ResponseEntity<List<TodoDTO>> getTodosByAssignee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(todoService.getTodosByAssignee(employeeId));
    }

    @GetMapping("/project/{projectCode}")
    public ResponseEntity<List<TodoDTO>> getTodosByProject(@PathVariable String projectCode) {
        return ResponseEntity.ok(todoService.getTodosByProject(projectCode));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TodoDTO>> getTodosByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(todoService.getTodosByTask(taskId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TodoDTO>> getTodosByStatus(@PathVariable String status) {
        return ResponseEntity.ok(todoService.getTodosByStatus(status));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TodoDTO>> getOverdueTodos() {
        return ResponseEntity.ok(todoService.getOverdueTodos());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TodoDTO>> getUpcomingTodos() {
        return ResponseEntity.ok(todoService.getUpcomingTodos());
    }

    @GetMapping("/type/personal")
    public ResponseEntity<List<TodoDTO>> getPersonalTodos() {
        return ResponseEntity.ok(todoService.getPersonalTodos());
    }

    @GetMapping("/type/project/{projectCode}")
    public ResponseEntity<List<TodoDTO>> getProjectTodos(@PathVariable String projectCode) {
        return ResponseEntity.ok(todoService.getProjectTodos(projectCode));
    }

    @GetMapping("/type/task/{taskId}")
    public ResponseEntity<List<TodoDTO>> getTaskTodos(@PathVariable Long taskId) {
        return ResponseEntity.ok(todoService.getTaskTodos(taskId));
    }
}
