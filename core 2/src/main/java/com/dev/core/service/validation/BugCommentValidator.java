package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.bug.BugCommentDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BugCommentValidator {

    public void validateBeforeAdd(Long bugId, BugCommentDTO dto) {
        if (bugId == null)
            throw new ValidationFailedException("Bug ID is required to add comment");

        if (dto == null || dto.getCommentText() == null || dto.getCommentText().isBlank())
            throw new ValidationFailedException("Comment text cannot be empty");
    }

    public void validateBeforeReply(Long parentCommentId, BugCommentDTO dto) {
        if (parentCommentId == null)
            throw new ValidationFailedException("Parent comment ID required to reply");

        if (dto == null || dto.getCommentText() == null || dto.getCommentText().isBlank())
            throw new ValidationFailedException("Reply text cannot be empty");
    }
}
