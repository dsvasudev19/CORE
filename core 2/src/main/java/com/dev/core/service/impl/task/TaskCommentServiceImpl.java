package com.dev.core.service.impl.task;

import com.dev.core.domain.Task;
import com.dev.core.domain.TaskComment;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.task.TaskCommentMapper;
import com.dev.core.model.task.TaskCommentDTO;
import com.dev.core.repository.task.TaskCommentRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.task.TaskAutomationService;
import com.dev.core.service.task.TaskCommentService;
import com.dev.core.service.validation.task.TaskCommentValidator;
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
public class TaskCommentServiceImpl implements TaskCommentService {

    private final TaskCommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final TaskCommentValidator commentValidator;
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
    // ADD COMMENT
    // --------------------------------------------------------------
    @Override
    public TaskCommentDTO addComment(TaskCommentDTO dto) {
        authorize("CREATE");
        commentValidator.validateBeforeAdd(dto);

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{dto.getTaskId()}));

        TaskComment entity = TaskCommentMapper.toEntity(dto);
        entity.setTask(task);

        TaskComment saved = commentRepository.save(entity);

        // Notify watchers/participants
        taskAutomationService.onTaskCommentAdded(task.getId(), saved.getId());

        return TaskCommentMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // REPLY TO COMMENT
    // --------------------------------------------------------------
    @Override
    public TaskCommentDTO replyToComment(Long parentCommentId, TaskCommentDTO dto) {
        authorize("CREATE");
        commentValidator.validateBeforeReply(parentCommentId);

        TaskComment parent = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new BaseException("error.parent.comment.not.found", new Object[]{parentCommentId}));

        dto.setTaskId(parent.getTask().getId());
        TaskComment reply = TaskCommentMapper.toEntity(dto);
        reply.setTask(parent.getTask());
        reply.setParentCommentId(parentCommentId);

        TaskComment saved = commentRepository.save(reply);

        taskAutomationService.onTaskCommentAdded(parent.getTask().getId(), saved.getId());

        return TaskCommentMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // GET COMMENTS BY TASK
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public List<TaskCommentDTO> getCommentsByTask(Long taskId) {
        authorize("READ");
        List<TaskComment> comments = commentRepository.findByTaskId(taskId);

        // Map comments to DTOs
        List<TaskCommentDTO> topLevel = comments.stream()
                .filter(c -> c.getParentCommentId() == null)
                .map(TaskCommentMapper::toDTO)
                .collect(Collectors.toList());

        // Build reply hierarchy
        for (TaskCommentDTO comment : topLevel) {
            comment.setReplies(getRepliesRecursive(comment.getId(), comments));
        }

        return topLevel;
    }

    private List<TaskCommentDTO> getRepliesRecursive(Long parentId, List<TaskComment> all) {
        return all.stream()
                .filter(c -> parentId.equals(c.getParentCommentId()))
                .map(TaskCommentMapper::toDTO)
                .peek(dto -> dto.setReplies(getRepliesRecursive(dto.getId(), all)))
                .collect(Collectors.toList());
    }

    // --------------------------------------------------------------
    // DELETE COMMENT
    // --------------------------------------------------------------
    @Override
    public void deleteComment(Long commentId) {
        authorize("DELETE");
        commentValidator.validateBeforeDelete(commentId);

        if (!commentRepository.existsById(commentId)) {
            throw new BaseException("error.comment.not.found", new Object[]{commentId});
        }

        // Remove nested replies (cascade-safe)
        List<TaskComment> replies = commentRepository.findByParentCommentId(commentId);
        replies.forEach(r -> deleteComment(r.getId()));

        commentRepository.deleteById(commentId);
    }

    // --------------------------------------------------------------
    // NOTIFY PARTICIPANTS
    // --------------------------------------------------------------
    @Override
    public void notifyParticipantsOnComment(Long taskId, Long commentId) {
        authorize("READ");
        try {
            taskAutomationService.onTaskCommentAdded(taskId, commentId);
        } catch (Exception e) {
            log.warn("Failed to notify participants for comment {} on task {}", commentId, taskId);
        }
    }
}
