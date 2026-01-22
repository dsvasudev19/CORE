package com.dev.core.controller.task;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.task.TaskCommentDTO;
import com.dev.core.service.task.TaskAutomationService;
import com.dev.core.service.task.TaskCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class TaskCommentController {

    private final TaskCommentService commentService;
    private final TaskAutomationService automationService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> addComment(@PathVariable Long taskId, @RequestBody TaskCommentDTO dto) {
    	dto.setTaskId(taskId);
        TaskCommentDTO saved = commentService.addComment(dto);
        automationService.onTaskCommentAdded(taskId, saved.getId());
        return helper.success("Comment added successfully", saved);
    }

    @GetMapping
    public ResponseEntity<?> getAll(@PathVariable Long taskId) {
        List<TaskCommentDTO> list = commentService.getCommentsByTask(taskId);
        return helper.success("Comments fetched successfully", list);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> delete(@PathVariable Long taskId, @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return helper.success("Comment deleted successfully");
    }
}
