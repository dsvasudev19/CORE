package com.dev.core.service.task;

import com.dev.core.model.task.TaskCommentDTO;

import java.util.List;

public interface TaskCommentService {

    TaskCommentDTO addComment(TaskCommentDTO dto);

    TaskCommentDTO replyToComment(Long parentCommentId, TaskCommentDTO dto);

    List<TaskCommentDTO> getCommentsByTask(Long taskId);

    void deleteComment(Long commentId);

    void notifyParticipantsOnComment(Long taskId, Long commentId);
}
