package com.dev.core.service.impl.task;

import com.dev.core.domain.Employee;
import com.dev.core.domain.Task;
import com.dev.core.exception.BaseException;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.task.TaskAssignmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskAssignmentServiceImpl implements TaskAssignmentService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthorizationService authorizationService;

    @Override
    public void assignEmployee(Long taskId, Long employeeId) {
        

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BaseException("error.employee.not.found", new Object[]{employeeId}));

        if (task.getAssignees().contains(employee)) {
            throw new BaseException("error.task.employee.already.assigned");
        }

        task.getAssignees().add(employee);
        taskRepository.save(task);
    }

    @Override
    public void unassignEmployee(Long taskId, Long employeeId) {
       

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        task.getAssignees().removeIf(e -> e.getId().equals(employeeId));

        taskRepository.save(task);
    }

    @Override
    public void replaceAssignees(Long taskId, Set<Long> employeeIds) {
        

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        Set<Employee> newAssignees = employeeRepository.findAllById(employeeIds)
                .stream().collect(java.util.stream.Collectors.toSet());

        task.setAssignees(newAssignees);

        taskRepository.save(task);
    }
}
