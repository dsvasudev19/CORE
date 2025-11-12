package com.dev.core.controller.bug;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.bug.BugCommentDTO;
import com.dev.core.service.bug.BugCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/bugs/comments")
@RequiredArgsConstructor
public class BugCommentController {

    private final BugCommentService commentService;
    private final ControllerHelper helper;

    @PostMapping("/bug/{bugId}")
    public ResponseEntity<?> addComment(@PathVariable Long bugId, @RequestBody BugCommentDTO dto) {
        log.info("💬 Adding comment for bug [{}]", bugId);
        return helper.success("Comment added", commentService.addComment(bugId, dto));
    }

    @PostMapping("/{parentCommentId}/reply")
    public ResponseEntity<?> replyToComment(@PathVariable Long parentCommentId, @RequestBody BugCommentDTO dto) {
        log.info("↩️ Replying to comment [{}]", parentCommentId);
        return helper.success("Reply added", commentService.replyToComment(parentCommentId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        log.info("🗑️ Deleting comment [{}]", id);
        commentService.deleteComment(id);
        return helper.success("Comment deleted successfully");
    }

    @GetMapping("/bug/{bugId}")
    public ResponseEntity<?> getComments(@PathVariable Long bugId) {
        log.info("🗨️ Fetching comments for bug [{}]", bugId);
        return helper.success("Comments fetched", commentService.getCommentsByBug(bugId));
    }
}
