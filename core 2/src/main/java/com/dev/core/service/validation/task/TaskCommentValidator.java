
package com.dev.core.service.validation.task;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.task.TaskCommentDTO;
import com.dev.core.repository.task.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskCommentValidator {

    private final TaskRepository taskRepository;

    public void validateBeforeAdd(TaskCommentDTO dto) {
        if (dto == null) throw new ValidationFailedException("Comment cannot be null");
        if (dto.getTaskId() == null) throw new ValidationFailedException("Task ID is required for comment");
        if (!taskRepository.existsById(dto.getTaskId()))
            throw new ValidationFailedException("Task not found for comment: " + dto.getTaskId());
        if (dto.getCommentText() == null || dto.getCommentText().isBlank())
            throw new ValidationFailedException("Comment text cannot be empty");
    }

    public void validateBeforeReply(Long parentCommentId) {
        if (parentCommentId == null || parentCommentId <= 0) {
            throw new ValidationFailedException("Parent comment ID is required for reply");
        }
    }

    public void validateBeforeDelete(Long commentId) {
        if (commentId == null || commentId <= 0)
            throw new ValidationFailedException("Invalid comment ID");
    }
}
