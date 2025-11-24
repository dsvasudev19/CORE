package com.dev.core.service.validation;


import org.springframework.stereotype.Component;

import com.dev.core.constants.TodoStatus;
import com.dev.core.constants.TodoType;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Task;
import com.dev.core.domain.Todo;
import com.dev.core.exception.BaseException;
import com.dev.core.model.TodoDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.task.TaskRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TodoValidator {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    // -------------------------------------------------------------------------
    // VALIDATE BEFORE CREATE
    // -------------------------------------------------------------------------
    public void validateBeforeCreate(TodoDTO dto) {
        if (dto == null) {
            throw new BaseException("error.todo.null.payload");
        }

        validateTypeRules(dto);
        validateAssociations(dto);
    }

    // -------------------------------------------------------------------------
    // VALIDATE BEFORE UPDATE
    // -------------------------------------------------------------------------
    public void validateBeforeUpdate(Long id, TodoDTO dto, Todo existing) {
        if (dto == null) {
            throw new BaseException("error.todo.null.payload");
        }

        if (existing == null) {
            throw new BaseException("error.todo.not.found", new Object[]{id});
        }

        validateTypeRules(dto);
        validateAssociations(dto);
    }

    // -------------------------------------------------------------------------
    // VALIDATE ASSIGNMENT
    // -------------------------------------------------------------------------
    public void validateAssignment(Long todoId, Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BaseException("error.employee.not.found", new Object[]{employeeId}));

        if (!Boolean.TRUE.equals(employee.getActive())) {
            throw new BaseException("error.employee.not.active", new Object[]{employeeId});
        }
    }

    // -------------------------------------------------------------------------
    // VALIDATE STATUS TRANSITION
    // -------------------------------------------------------------------------
    public void validateStatusChange(Todo todo, TodoStatus newStatus) {
        if (todo == null) {
            throw new BaseException("error.todo.not.found");
        }

        TodoStatus current = todo.getStatus();

        // Allowed transitions:
        // PENDING → IN_PROGRESS → COMPLETED
        // Any → BLOCKED / CANCELLED
        boolean valid =
                (current == TodoStatus.PENDING && newStatus == TodoStatus.IN_PROGRESS) ||
                (current == TodoStatus.IN_PROGRESS && newStatus == TodoStatus.COMPLETED) ||
                (newStatus == TodoStatus.BLOCKED) ||
                (newStatus == TodoStatus.CANCELLED);

        if (!valid) {
            throw new BaseException("error.todo.invalid.status.transition",
                    new Object[]{current, newStatus});
        }
    }

    // -------------------------------------------------------------------------
    // TYPE RULE VALIDATION (PERSONAL/PROJECT/TASK)
    // -------------------------------------------------------------------------
    private void validateTypeRules(TodoDTO dto) {
        TodoType type = dto.getType();

        switch (type) {

            case PERSONAL:
                if (dto.getProject() != null || dto.getTask() != null) {
                    throw new BaseException("error.todo.personal.no.project.or.task");
                }
                break;

            case PROJECT:
                if (dto.getProject() == null || dto.getProject().getCode() == null) {
                    throw new BaseException("error.todo.project.required");
                }

                if (dto.getTask() != null) {
                    throw new BaseException("error.todo.project.cannot.have.task");
                }
                break;

            case TASK:
                if (dto.getTask() == null || dto.getTask().getId() == null) {
                    throw new BaseException("error.todo.task.required");
                }
                // Project is optional; will be auto-set from task.
                break;

            default:
                throw new BaseException("error.todo.invalid.type");
        }
    }

    // -------------------------------------------------------------------------
    // ASSOCIATE ENTITY VALIDATION
    // -------------------------------------------------------------------------
    private void validateAssociations(TodoDTO dto) {

        // Validate assignee
        if (dto.getAssignee() != null && dto.getAssignee().getId() != null) {
            Employee employee = employeeRepository.findById(dto.getAssignee().getId())
                    .orElseThrow(() -> new BaseException("error.employee.not.found",
                            new Object[]{dto.getAssignee().getId()}));

            if (!Boolean.TRUE.equals(employee.getActive())) {
                throw new BaseException("error.employee.not.active", new Object[]{employee.getId()});
            }
        }

        // Validate Project (if provided)
        if (dto.getProject() != null && dto.getProject().getCode() != null) {
            projectRepository.findByCode(dto.getProject().getCode())
                    .orElseThrow(() -> new BaseException("error.project.not.found",
                            new Object[]{dto.getProject().getCode()}));
        }

        // Validate Task (if provided)
        if (dto.getTask() != null && dto.getTask().getId() != null) {
            Task task = taskRepository.findById(dto.getTask().getId())
                    .orElseThrow(() -> new BaseException("error.task.not.found",
                            new Object[]{dto.getTask().getId()}));

            // If project provided, ensure project matches task.project
            if (dto.getProject() != null &&
                dto.getProject().getCode() != null &&
                task.getProject() != null &&
                !dto.getProject().getCode().equals(task.getProject().getCode())) {
                throw new BaseException("error.todo.project.task.mismatch");
            }
        }
    }
}
