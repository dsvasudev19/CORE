package com.dev.core.service.todo;

import java.util.List;

import com.dev.core.model.TodoDTO;

public interface TodoService {

    // ----------------------------------------------------------------------
    // CRUD
    // ----------------------------------------------------------------------
    TodoDTO createTodo(TodoDTO dto);

    TodoDTO updateTodo(Long id, TodoDTO dto);

    void deleteTodo(Long id);

    TodoDTO getTodoById(Long id);

    List<TodoDTO> getAllTodos();

    // ----------------------------------------------------------------------
    // Status Management
    // ----------------------------------------------------------------------
    TodoDTO markInProgress(Long id);

    TodoDTO markCompleted(Long id);

    TodoDTO markBlocked(Long id);

    TodoDTO markCancelled(Long id);

    // ----------------------------------------------------------------------
    // Assignment
    // ----------------------------------------------------------------------
    TodoDTO assignToEmployee(Long todoId, Long employeeId);

    TodoDTO unassign(Long todoId);

    // ----------------------------------------------------------------------
    // Linking / Unlinking
    // ----------------------------------------------------------------------
    TodoDTO linkToProject(Long todoId, String projectCode);

    TodoDTO unlinkProject(Long todoId);

    TodoDTO linkToTask(Long todoId, Long taskId);

    TodoDTO unlinkTask(Long todoId);

    // ----------------------------------------------------------------------
    // Filters
    // ----------------------------------------------------------------------
    List<TodoDTO> getTodosByAssignee(Long employeeId);

    List<TodoDTO> getTodosByProject(String projectCode);

    List<TodoDTO> getTodosByTask(Long taskId);

    List<TodoDTO> getTodosByStatus(String status);

    List<TodoDTO> getOverdueTodos();

    List<TodoDTO> getUpcomingTodos();

    List<TodoDTO> getPersonalTodos();

    List<TodoDTO> getProjectTodos(String projectCode);

    List<TodoDTO> getTaskTodos(Long taskId);

}
