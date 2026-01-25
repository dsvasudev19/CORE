package com.dev.core.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.OperationType;
import com.dev.core.constants.TodoStatus;
import com.dev.core.constants.TodoType;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.domain.Todo;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.todo.TodoMapper;
import com.dev.core.model.TodoDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.TodoRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.BaseEntityAuditService;
import com.dev.core.service.todo.TodoService;
import com.dev.core.service.validation.TodoValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    private final TodoValidator validator;
    private final BaseEntityAuditService baseEntityAuditService;
    private final SecurityContextUtil securityContextUtil;

    // -------------------------------------------------------------------------
    // CRUD
    // -------------------------------------------------------------------------

    @Override
    public TodoDTO createTodo(TodoDTO dto) {

        // Always personal → assignee must be current user
        var currentEmployee = securityContextUtil.getCurrentEmployee();
        dto.setAssignee(currentEmployee);

        validator.validateBeforeCreate(dto);

        Todo entity = TodoMapper.toEntity(dto);
        baseEntityAuditService.applyAudit(entity, OperationType.CREATE);

        // For TASK type → auto-set project
        if (dto.getType() == TodoType.TASK && dto.getTask() != null) {
            Task task = taskRepository.findById(dto.getTask().getId())
                    .orElseThrow(() -> new BaseException("error.task.not.found"));
            entity.setTask(task);
            entity.setProject(task.getProject());
        }

        // For PROJECT type → assign project
        if (dto.getType() == TodoType.PROJECT && dto.getProject() != null) {
            Project project = projectRepository.findByCode(dto.getProject().getCode())
                    .orElseThrow(() -> new BaseException("error.project.not.found"));
            entity.setProject(project);
        }

        Todo saved = todoRepository.save(entity);
        return TodoMapper.toDTO(saved);
    }

    @Override
    public TodoDTO updateTodo(Long id, TodoDTO dto) {
        Todo existing = todoRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.todo.not.found", new Object[]{id}));

        validator.validateBeforeUpdate(id, dto, existing);

        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setPriority(dto.getPriority());
        existing.setType(dto.getType());
        existing.setDueDate(dto.getDueDate());

        // Type-specific logic
        if (dto.getType() == TodoType.PERSONAL) {
            existing.setProject(null);
            existing.setTask(null);
        }

        if (dto.getType() == TodoType.PROJECT) {
            Project project = projectRepository.findByCode(dto.getProject().getCode())
                    .orElseThrow(() -> new BaseException("error.project.not.found"));
            existing.setProject(project);
            existing.setTask(null);
        }

        if (dto.getType() == TodoType.TASK) {
            Task task = taskRepository.findById(dto.getTask().getId())
                    .orElseThrow(() -> new BaseException("error.task.not.found"));
            existing.setTask(task);
            existing.setProject(task.getProject());
        }

        baseEntityAuditService.applyAudit(existing, OperationType.UPDATE);

        Todo saved = todoRepository.save(existing);
        return TodoMapper.toDTO(saved);
    }

    @Override
    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        baseEntityAuditService.applyAudit(todo, OperationType.DELETE);
        todoRepository.save(todo); // soft delete
    }

    @Override
    public TodoDTO getTodoById(Long id) {
        Todo entity = todoRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));
        return TodoMapper.toDTO(entity);
    }

    @Override
    public List<TodoDTO> getAllTodos() {
        return todoRepository.findAll()
                .stream()
                .map(TodoMapper::toDTO)
                .toList();
    }

    // -------------------------------------------------------------------------
    // STATUS MANAGEMENT
    // -------------------------------------------------------------------------

    @Override
    public TodoDTO markInProgress(Long id) {
        return updateStatus(id, TodoStatus.IN_PROGRESS);
    }

    @Override
    public TodoDTO markCompleted(Long id) {
        return updateStatus(id, TodoStatus.COMPLETED);
    }

    @Override
    public TodoDTO markBlocked(Long id) {
        return updateStatus(id, TodoStatus.BLOCKED);
    }

    @Override
    public TodoDTO markCancelled(Long id) {
        return updateStatus(id, TodoStatus.CANCELLED);
    }

    private TodoDTO updateStatus(Long id, TodoStatus status) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        validator.validateStatusChange(todo, status);

        todo.setStatus(status);

        if (status == TodoStatus.COMPLETED) {
            todo.setCompletedAt(java.time.LocalDateTime.now());
        }

        baseEntityAuditService.applyAudit(todo, OperationType.STATUS_CHANGE);
        return TodoMapper.toDTO(todoRepository.save(todo));
    }

    // -------------------------------------------------------------------------
    // ASSIGNMENT
    // -------------------------------------------------------------------------

    @Override
    public TodoDTO assignToEmployee(Long todoId, Long employeeId) {

        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        validator.validateAssignment(todoId, employeeId);

        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BaseException("error.employee.not.found"));

        todo.setAssignee(emp);

        baseEntityAuditService.applyAudit(todo, OperationType.UPDATE);

        return TodoMapper.toDTO(todoRepository.save(todo));
    }

    @Override
    public TodoDTO unassign(Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        todo.setAssignee(null);

        baseEntityAuditService.applyAudit(todo, OperationType.UPDATE);

        return TodoMapper.toDTO(todoRepository.save(todo));
    }

    // -------------------------------------------------------------------------
    // PROJECT / TASK LINKING
    // -------------------------------------------------------------------------

    @Override
    public TodoDTO linkToProject(Long todoId, String projectCode) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        Project project = projectRepository.findByCode(projectCode)
                .orElseThrow(() -> new BaseException("error.project.not.found"));

        todo.setProject(project);
        todo.setTask(null);

        baseEntityAuditService.applyAudit(todo, OperationType.UPDATE);

        return TodoMapper.toDTO(todoRepository.save(todo));
    }

    @Override
    public TodoDTO unlinkProject(Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        todo.setProject(null);

        baseEntityAuditService.applyAudit(todo, OperationType.UPDATE);

        return TodoMapper.toDTO(todoRepository.save(todo));
    }

    @Override
    public TodoDTO linkToTask(Long todoId, Long taskId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found"));

        todo.setTask(task);
        todo.setProject(task.getProject());

        baseEntityAuditService.applyAudit(todo, OperationType.UPDATE);

        return TodoMapper.toDTO(todoRepository.save(todo));
    }

    @Override
    public TodoDTO unlinkTask(Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new BaseException("error.todo.not.found"));

        todo.setTask(null);

        baseEntityAuditService.applyAudit(todo, OperationType.UPDATE);

        return TodoMapper.toDTO(todoRepository.save(todo));
    }

    // -------------------------------------------------------------------------
    // FILTERS
    // -------------------------------------------------------------------------

    @Override
    public List<TodoDTO> getTodosByAssignee(Long employeeId) {
        return todoRepository.findByAssignee_Id(employeeId)
                .stream()
                .map(TodoMapper::toDTO)
                .toList();
    }
    
    @Override
    public List<TodoDTO> getMyTodos(Long organizationId) {
        Long employeeId = securityContextUtil.getCurrentEmployee().getId();
        return todoRepository.findMyTodos(organizationId, employeeId)
                .stream()
                .map(TodoMapper::toDTO)
                .toList();
    }

    @Override
    public List<TodoDTO> getTodosByProject(String projectCode) {
        return todoRepository.findByAssignee_IdAndProject_Code(
                securityContextUtil.getCurrentEmployee().getId(),
                projectCode
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }

    @Override
    public List<TodoDTO> getTodosByTask(Long taskId) {
        return todoRepository.findByAssignee_IdAndTask_Id(
                securityContextUtil.getCurrentEmployee().getId(),
                taskId
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }

    @Override
    public List<TodoDTO> getTodosByStatus(String status) {
        TodoStatus todoStatus = TodoStatus.valueOf(status.toUpperCase());
        return todoRepository.findByAssignee_IdAndStatus(
                securityContextUtil.getCurrentEmployee().getId(),
                todoStatus
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }

    @Override
    public List<TodoDTO> getOverdueTodos() {
        return todoRepository.findByAssignee_IdAndDueDateBeforeAndStatusNot(
                securityContextUtil.getCurrentEmployee().getId(),
                LocalDate.now(),
                TodoStatus.COMPLETED
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }

    @Override
    public List<TodoDTO> getUpcomingTodos() {
        return todoRepository.findByAssignee_IdAndDueDateGreaterThanEqual(
                securityContextUtil.getCurrentEmployee().getId(),
                LocalDate.now()
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }

    @Override
    public List<TodoDTO> getPersonalTodos() {
        return todoRepository.findByAssignee_IdAndType(
                securityContextUtil.getCurrentEmployee().getId(),
                TodoType.PERSONAL
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }

    @Override
    public List<TodoDTO> getProjectTodos(String projectCode) {
        return todoRepository.findByAssignee_IdAndTypeAndProject_Code(
                securityContextUtil.getCurrentEmployee().getId(),
                TodoType.PROJECT,
                projectCode
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }

    @Override
    public List<TodoDTO> getTaskTodos(Long taskId) {
        return todoRepository.findByAssignee_IdAndTypeAndTask_Id(
                securityContextUtil.getCurrentEmployee().getId(),
                TodoType.TASK,
                taskId
        ).stream()
        .map(TodoMapper::toDTO)
        .toList();
    }
}
