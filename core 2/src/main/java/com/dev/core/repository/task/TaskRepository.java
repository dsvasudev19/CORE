package com.dev.core.repository.task;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByParentTaskId(Long parentTaskId);

    boolean existsByParentTaskId(Long parentTaskId);

    List<Task> findByOwnerId(Long ownerId);

    List<Task> findByAssignees_Id(Long userId);

    boolean existsByProjectId(Long projectId);

    @Query("SELECT COUNT(t) > 0 FROM Task t WHERE t.id = :taskId AND t.status <> 'DONE'")
    boolean existsIncompleteById(Long taskId);

    @Query("SELECT CASE WHEN COUNT(td) > 0 THEN true ELSE false END " +
           "FROM TaskDependency td WHERE td.task.id = :taskId AND td.dependsOn.id = :dependsOnTaskId")
    boolean existsDependency(Long taskId, Long dependsOnTaskId);

    /**
     * Detect circular dependencies between two tasks.
     * (Simple recursive check simulation — service may extend for deeper cycles.)
     */
    @Query("SELECT CASE WHEN COUNT(td) > 0 THEN true ELSE false END " +
           "FROM TaskDependency td WHERE td.task.id = :dependsOnTaskId AND td.dependsOn.id = :taskId")
    boolean existsDependencyCycle(Long taskId, Long dependsOnTaskId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.parentTask.id = :parentTaskId AND t.status <> 'DONE'")
    long countIncompleteSubtasks(Long parentTaskId);
    
    @Query("SELECT t FROM Task t WHERE t.status <> 'DONE' AND t.dueDate IS NOT NULL")
    List<Task> findActiveTasksWithDueDates();

    @Query("SELECT t FROM Task t WHERE t.status <> 'DONE' AND t.dueDate <= CURRENT_TIMESTAMP")
    List<Task> findOverdueTasks();

    @Query("SELECT t FROM Task t WHERE t.status <> 'DONE' AND t.dueDate BETWEEN CURRENT_TIMESTAMP AND :upcoming")
    List<Task> findTasksDueBefore(@Param("upcoming") LocalDateTime upcoming);

}
