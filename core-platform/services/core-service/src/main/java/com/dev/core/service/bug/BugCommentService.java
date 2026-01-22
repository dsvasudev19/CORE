package com.dev.core.service.bug;

import com.dev.core.model.bug.BugCommentDTO;

import java.util.List;

public interface BugCommentService {

    BugCommentDTO addComment(Long bugId, BugCommentDTO dto);

    BugCommentDTO replyToComment(Long parentCommentId, BugCommentDTO dto);

    void deleteComment(Long id);

    List<BugCommentDTO> getCommentsByBug(Long bugId);
}
