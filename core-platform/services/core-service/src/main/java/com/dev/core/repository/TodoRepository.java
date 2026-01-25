package com.dev.core.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.core.constants.TodoStatus;
import com.dev.core.constants.TodoType;
import com.dev.core.domain.Todo;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    // -------------------------------------------------------------------------
    // PERSONAL TODOS (must always be assigned to one employee)
    // -------------------------------------------------------------------------
    List<Todo> findByAssignee_Id(Long assigneeId);

    List<Todo> findByAssignee_IdAndStatus(Long assigneeId, TodoStatus status);

    List<Todo> findByAssignee_IdAndType(Long assigneeId, TodoType type);

    // -------------------------------------------------------------------------
    // PROJECT-LINKED TODOS
    // -------------------------------------------------------------------------
    List<Todo> findByAssignee_IdAndProject_Code(Long assigneeId, String projectCode);

    List<Todo> findByAssignee_IdAndTypeAndProject_Code(Long assigneeId, TodoType type, String projectCode);

    // -------------------------------------------------------------------------
    // TASK-LINKED TODOS
    // -------------------------------------------------------------------------
    List<Todo> findByAssignee_IdAndTask_Id(Long assigneeId, Long taskId);

    List<Todo> findByAssignee_IdAndTypeAndTask_Id(Long assigneeId, TodoType type, Long taskId);

    
    // -------------------------------------------------------------------------
    // DATE FILTERS (per user)
    // -------------------------------------------------------------------------
    List<Todo> findByAssignee_IdAndDueDateBeforeAndStatusNot(
            Long assigneeId,
            LocalDate date,
            TodoStatus excludedStatus
    );

    List<Todo> findByAssignee_IdAndDueDateGreaterThanEqual(
            Long assigneeId,
            LocalDate date
    );

    // -------------------------------------------------------------------------
    // MULTI-TENANT OPTIONAL (ORGANIZATION SCOPING)
    // -------------------------------------------------------------------------
    List<Todo> findByOrganizationId(Long organizationId);

    List<Todo> findByOrganizationIdAndAssignee_Id(Long organizationId, Long assigneeId);
    
    // Get todos where user is either the creator or assignee
    @Query("""
        SELECT DISTINCT t
        FROM Todo t
        WHERE t.organizationId = :orgId
          AND (t.createdBy = :employeeId OR t.assignee.id = :employeeId)
        ORDER BY t.dueDate ASC
    """)
    List<Todo> findMyTodos(@Param("orgId") Long orgId, @Param("employeeId") Long employeeId);
}
