package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.bug.BugCommentDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BugCommentValidator {

    public void validateBeforeAdd(Long bugId, BugCommentDTO dto) {
        if (bugId == null) {
            throw new ValidationFailedException("error.bug.comment.bugId.required",null);
        }

        if (dto == null || dto.getCommentText() == null || dto.getCommentText().isBlank()) {
            throw new ValidationFailedException("error.bug.comment.text.required",null);
        }

        log.debug("✅ BugCommentValidator.validateBeforeAdd passed for bugId={}", bugId);
    }

    public void validateBeforeReply(Long parentCommentId, BugCommentDTO dto) {
        if (parentCommentId == null) {
            throw new ValidationFailedException("error.bug.comment.parentId.required",null);
        }

        if (dto == null || dto.getCommentText() == null || dto.getCommentText().isBlank()) {
            throw new ValidationFailedException("error.bug.comment.replyText.required",null);
        }

        log.debug("✅ BugCommentValidator.validateBeforeReply passed for parentCommentId={}", parentCommentId);
    }
}
