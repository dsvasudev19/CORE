package com.dev.core.repository.task;

import com.dev.core.domain.TaskAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long>, JpaSpecificationExecutor<TaskAttachment> {

    List<TaskAttachment> findByTaskId(Long taskId);
}
