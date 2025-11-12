package com.dev.core.repository.task;

import com.dev.core.domain.TaskDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskDependencyRepository extends JpaRepository<TaskDependency, Long>, JpaSpecificationExecutor<TaskDependency> {

    List<TaskDependency> findByTaskId(Long taskId);

    List<TaskDependency> findByDependsOn_Id(Long taskId);

    boolean existsByTask_IdAndDependsOn_Id(Long taskId, Long dependsOnTaskId);
}
