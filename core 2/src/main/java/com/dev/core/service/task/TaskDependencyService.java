package com.dev.core.service.task;

import com.dev.core.model.task.TaskDependencyDTO;

import java.util.List;

public interface TaskDependencyService {

    TaskDependencyDTO createDependency(TaskDependencyDTO dto);

    void deleteDependency(Long id);

    List<TaskDependencyDTO> getDependenciesByTask(Long taskId);

    List<TaskDependencyDTO> getDependents(Long taskId);

    boolean hasUnresolvedDependencies(Long taskId);
}
