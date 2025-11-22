package com.dev.core.service.impl.task;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.OperationType;
import com.dev.core.constants.TaskPriority;
import com.dev.core.constants.TaskStatus;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.options.TaskMapperOptions;
import com.dev.core.mapper.task.TaskMapper;
import com.dev.core.model.task.TaskDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.BaseEntityAuditService;
import com.dev.core.service.task.TaskAutomationService;
import com.dev.core.service.task.TaskService;
import com.dev.core.service.validation.task.TaskValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskValidator taskValidator;
    private final AuthorizationService authorizationService;
    private final TaskAutomationService taskAutomationService;
    private final EmployeeRepository employeeRepository;
    private final SecurityContextUtil securityContextUtil;
    private final BaseEntityAuditService baseAuditService;
    private final TaskMapper taskMapper;

    // ✅ Authorization wrapper for all actions
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    // --------------------------------------------------------------
    // CREATE TASK
    // --------------------------------------------------------------
    @Override
    public TaskDTO createTask(TaskDTO dto) {
        authorize("CREATE");
        taskValidator.validateBeforeCreate(dto);
        taskValidator.validateAssignees(dto);
        taskValidator.validateDueDate(dto);

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{dto.getProjectId()}));

        Task entity = taskMapper.toEntity(dto, project);

        // Set parent task if applicable
        if (dto.getParentTaskId() != null) {
            Task parent = taskRepository.findById(dto.getParentTaskId())
                    .orElseThrow(() -> new BaseException("error.parent.task.not.found", new Object[]{dto.getParentTaskId()}));
            entity.setParentTask(parent);
        }

        // Set assignees
        if (dto.getAssigneeIds() != null && !dto.getAssigneeIds().isEmpty()) {
        	Set<Employee> assignees = new HashSet<>(employeeRepository.findAllById(dto.getAssigneeIds()));
        	entity.setAssignees(assignees);


        }
        baseAuditService.applyAudit(entity, OperationType.CREATE);
        entity.setOwnerId(securityContextUtil.getCurrentEmployee().getId());

        Task saved = taskRepository.save(entity);

        // Fire automation hook
        taskAutomationService.onTaskCreated(saved.getId());

        return taskMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // UPDATE TASK
    // --------------------------------------------------------------
    @Override
    public TaskDTO updateTask(Long id, TaskDTO dto) {
        authorize("UPDATE");
        taskValidator.validateBeforeUpdate(id, dto);

        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{id}));

        // Update editable fields
        if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        if (dto.getPriority() != null) existing.setPriority(dto.getPriority());
        if (dto.getStartDate() != null) existing.setStartDate(dto.getStartDate());
        if (dto.getDueDate() != null) existing.setDueDate(dto.getDueDate());
        if (dto.getEstimatedHours() != null) existing.setEstimatedHours(dto.getEstimatedHours());
        if (dto.getOwnerId() != null) existing.setOwnerId(dto.getOwnerId());
        if (dto.getProgressPercentage() !=null ) existing.setProgressPercentage(dto.getProgressPercentage());        // Update assignees if provided
        if (dto.getAssigneeIds() != null) {
        	Set<Employee> employees = new HashSet<>(employeeRepository.findAllById(dto.getAssigneeIds()));
        	existing.setAssignees(employees);

        }
        baseAuditService.applyAudit(existing, OperationType.UPDATE);
        
        Task updated = taskRepository.save(existing);
        return taskMapper.toDTO(updated);
    }

    // --------------------------------------------------------------
    // DELETE TASK
    // --------------------------------------------------------------
    @Override
    public void deleteTask(Long id, boolean deleteSubtasks) {
        authorize("DELETE");
        taskValidator.validateBeforeDelete(id, deleteSubtasks);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{id}));

        if (deleteSubtasks) {
            taskRepository.findByParentTaskId(id)
                    .forEach(sub -> taskRepository.deleteById(sub.getId()));
        }
        baseAuditService.applyAudit(task, OperationType.DELETE);

//        taskRepository.deleteById(id);
        taskAutomationService.onTaskDeleted(id);
    }

    // --------------------------------------------------------------
    // GET TASK BY ID
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public TaskDTO getTaskById(Long id, boolean includeNested) {
        authorize("READ");

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{id}));

        TaskMapperOptions options = includeNested
                ? TaskMapperOptions.builder()
                    .includeAttachments(true)
                    .includeComments(true)
                    .includeDependencies(true)
                    .includeTags(true)
                    .includeSubtasks(true)
                    .build()
                : TaskMapperOptions.builder()
                    .includeAttachments(false)
                    .includeComments(false)
                    .includeDependencies(false)
                    .includeTags(false)
                    .includeSubtasks(false)
                    .build();

        return taskMapper.toDTO(task, options);
    }

    // --------------------------------------------------------------
    // GET ALL TASKS BY PROJECT
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public List<TaskDTO> getTasksByProject(Long projectId) {
        authorize("READ");
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }

    // --------------------------------------------------------------
    // SEARCH TASKS
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public Page<TaskDTO> searchTasks(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");
        Page<Task> page = taskRepository.findAll(
                SpecificationBuilder.of(Task.class)
                        .equals("organizationId", organizationId)
                        .contains("title", keyword)
                        .build(),
                pageable
        );
        return page.map(taskMapper::toDTO);
    }

    // --------------------------------------------------------------
    // ASSIGN USERS
    // --------------------------------------------------------------
    @Override
    public TaskDTO assignUsers(Long taskId, List<Long> userIds) {
        authorize("UPDATE");

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        if (userIds == null || userIds.isEmpty())
            throw new BaseException("error.task.assignees.required");

        Set<Employee> employees = new HashSet<>(employeeRepository.findAllById(userIds));
        task.setAssignees(employees);
        


        Task saved = taskRepository.save(task);
        employees.forEach(e -> taskAutomationService.onTaskAssigned(taskId, e.getId()));

        baseAuditService.applyAudit(saved, OperationType.UPDATE);

        return taskMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // STATUS CHANGE
    // --------------------------------------------------------------
    @Override
    public TaskDTO updateTaskStatus(Long taskId, String newStatusStr) {
        authorize("UPDATE");

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        TaskStatus newStatus;
        try {
            newStatus = TaskStatus.valueOf(newStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BaseException("Invalid task status: " + newStatusStr);
        }

        taskValidator.validateStatusTransition(task, newStatus);
        TaskStatus oldStatus = task.getStatus();

        task.setStatus(newStatus);

        if (newStatus == TaskStatus.DONE) {
            task.setCompletedAt(java.time.LocalDateTime.now());
            recalculateTaskProgress(task.getId());
            taskAutomationService.onTaskCompleted(task.getId());
        }
        baseAuditService.applyAudit(task, OperationType.UPDATE);


        Task updated = taskRepository.save(task);
        taskAutomationService.onTaskStatusChanged(taskId, oldStatus.name(), newStatus.name());

        // Auto close parent if all subtasks are done
        if (task.getParentTask() != null) {
            checkAndAutoCloseParent(task.getParentTask().getId());
        }

        return taskMapper.toDTO(updated);
    }

    // --------------------------------------------------------------
    // PRIORITY UPDATE
    // --------------------------------------------------------------
    @Override
    public TaskDTO updateTaskPriority(Long taskId, String priorityStr) {
        authorize("UPDATE");

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        String oldPriority = task.getPriority().name();

        task.setPriority(TaskPriority.valueOf(priorityStr.toUpperCase()));

        baseAuditService.applyAudit(task, OperationType.UPDATE);

        Task updated = taskRepository.save(task);
        taskAutomationService.onTaskPriorityChanged(taskId, oldPriority, priorityStr);

        return taskMapper.toDTO(updated);
    }


    // --------------------------------------------------------------
    // PROGRESS RECALCULATION
    // --------------------------------------------------------------
    @Override
    public void recalculateTaskProgress(Long taskId) {
        List<Task> subtasks = taskRepository.findByParentTaskId(taskId);
        if (subtasks.isEmpty()) return;

        long total = subtasks.size();
        long done = subtasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();

        int progress = (int) ((done * 100.0) / total);
        Task parent = taskRepository.findById(taskId).orElseThrow();
        parent.setProgressPercentage(progress);

        baseAuditService.applyAudit(parent, OperationType.UPDATE);

        
        taskRepository.save(parent);

        if (done == total) {
            taskAutomationService.onSubtaskAllDone(parent.getId());
        }
    }

    // --------------------------------------------------------------
    // DEPENDENCIES
    // --------------------------------------------------------------
    @Override
    public void addDependency(Long taskId, Long dependsOnTaskId, String dependencyType) {
        authorize("UPDATE");
        taskValidator.validateBeforeUpdate(taskId, new TaskDTO());
        if (taskRepository.existsDependency(taskId, dependsOnTaskId))
            throw new BaseException("Dependency already exists between these tasks");

        Task task = taskRepository.findById(taskId).orElseThrow();
        Task dependsOn = taskRepository.findById(dependsOnTaskId).orElseThrow();

        com.dev.core.domain.TaskDependency dependency = new com.dev.core.domain.TaskDependency();
        dependency.setTask(task);
        dependency.setDependsOn(dependsOn);
        dependency.setDependencyType(dependencyType);
        dependency.setOrganizationId(task.getOrganizationId());

        task.getDependencies().add(dependency);
        taskRepository.save(task);
    }

    @Override
    public void removeDependency(Long taskId, Long dependsOnTaskId) {
        authorize("UPDATE");
        taskRepository.findById(taskId).ifPresent(task ->
                task.getDependencies().removeIf(d -> d.getDependsOn().getId().equals(dependsOnTaskId))
        );
    }

    @Override
    public List<TaskDTO> getDependencies(Long taskId) {
        authorize("READ");
        Task task = taskRepository.findById(taskId).orElseThrow();
        return task.getDependencies().stream()
                .map(dep -> taskMapper.toDTO(dep.getDependsOn()))
                .collect(Collectors.toList());
    }

    // --------------------------------------------------------------
    // COMPLETE TASK
    // --------------------------------------------------------------
    @Override
    public TaskDTO markTaskComplete(Long taskId) {
        return updateTaskStatus(taskId, TaskStatus.DONE.name());
    }

    // --------------------------------------------------------------
    // TASKS BY ASSIGNEE
    // --------------------------------------------------------------
    @Override
    public List<TaskDTO> getTasksByAssignee(Long userId) {
        authorize("READ");
        return taskRepository.findByAssignees_Id(userId)
                .stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TaskDTO> getMyTasks(Long organizationId) {

        Long employeeId = securityContextUtil.getCurrentEmployee().getId();

        List<Task> tasks = taskRepository.findMyTasks(organizationId, employeeId);

        return tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }


    // --------------------------------------------------------------
    // AUTO CLOSE PARENT
    // --------------------------------------------------------------
    @Override
    public void checkAndAutoCloseParent(Long parentTaskId) {
        long remaining = taskRepository.countIncompleteSubtasks(parentTaskId);
        if (remaining == 0) {
            markTaskComplete(parentTaskId);
        }
    }
}
