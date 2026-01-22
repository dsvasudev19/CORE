package com.dev.core.service.impl.task;

import com.dev.core.domain.Task;
import com.dev.core.domain.TaskDependency;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.task.TaskDependencyMapper;
import com.dev.core.model.task.TaskDependencyDTO;
import com.dev.core.repository.task.TaskDependencyRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.task.TaskAutomationService;
import com.dev.core.service.task.TaskDependencyService;
import com.dev.core.service.validation.task.TaskDependencyValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskDependencyServiceImpl implements TaskDependencyService {

    private final TaskDependencyRepository dependencyRepository;
    private final TaskRepository taskRepository;
    private final TaskDependencyValidator dependencyValidator;
    private final AuthorizationService authorizationService;
    private final TaskAutomationService taskAutomationService;

    // --- AUTHORIZATION WRAPPER ---
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    // --------------------------------------------------------------
    // CREATE DEPENDENCY
    // --------------------------------------------------------------
    @Override
    public TaskDependencyDTO createDependency(TaskDependencyDTO dto) {
        authorize("CREATE");
        dependencyValidator.validateBeforeCreate(dto);

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{dto.getTaskId()}));

        Task dependsOn = taskRepository.findById(dto.getDependsOnTaskId())
                .orElseThrow(() -> new BaseException("error.dependency.task.not.found", new Object[]{dto.getDependsOnTaskId()}));

        if (dependencyRepository.existsByTask_IdAndDependsOn_Id(dto.getTaskId(), dto.getDependsOnTaskId())) {
            throw new BaseException("Dependency already exists between these tasks");
        }

        TaskDependency entity = new TaskDependency();
        entity.setTask(task);
        entity.setDependsOn(dependsOn);
        entity.setDependencyType(dto.getDependencyType());
        entity.setOrganizationId(task.getOrganizationId());
        entity.setActive(true);

        TaskDependency saved = dependencyRepository.save(entity);

        log.info("✅ Dependency created: Task {} depends on Task {}", task.getId(), dependsOn.getId());

        return TaskDependencyMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // DELETE DEPENDENCY
    // --------------------------------------------------------------
    @Override
    public void deleteDependency(Long id) {
        authorize("DELETE");
        dependencyValidator.validateBeforeDelete(id);

        TaskDependency dependency = dependencyRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.dependency.not.found", new Object[]{id}));

        dependencyRepository.delete(dependency);

        taskAutomationService.onDependencyResolved(dependency.getTask().getId(), dependency.getId());
    }

    // --------------------------------------------------------------
    // GET DEPENDENCIES BY TASK
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public List<TaskDependencyDTO> getDependenciesByTask(Long taskId) {
        authorize("READ");
        return dependencyRepository.findByTaskId(taskId)
                .stream()
                .map(TaskDependencyMapper::toDTO)
                .collect(Collectors.toList());
    }

    // --------------------------------------------------------------
    // GET DEPENDENTS (TASKS BLOCKED BY GIVEN TASK)
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public List<TaskDependencyDTO> getDependents(Long taskId) {
        authorize("READ");
        return dependencyRepository.findByDependsOn_Id(taskId)
                .stream()
                .map(TaskDependencyMapper::toDTO)
                .collect(Collectors.toList());
    }

    // --------------------------------------------------------------
    // CHECK UNRESOLVED DEPENDENCIES
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public boolean hasUnresolvedDependencies(Long taskId) {
        authorize("READ");
        return dependencyRepository.findByTaskId(taskId)
                .stream()
                .map(TaskDependency::getDependsOn)
                .anyMatch(t -> t.getStatus() != com.dev.core.constants.TaskStatus.DONE);
    }
}
