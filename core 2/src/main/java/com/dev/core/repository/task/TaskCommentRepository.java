package com.dev.core.repository.task;

import com.dev.core.domain.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long>, JpaSpecificationExecutor<TaskComment> {

    List<TaskComment> findByTaskId(Long taskId);

    List<TaskComment> findByParentCommentId(Long parentCommentId);
}
