package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Component
public class BugAttachmentValidator {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    public void validateBeforeUpload(Long bugId, MultipartFile file) {

        if (bugId == null) {
            throw new ValidationFailedException("error.bug.attachment.bugId.required");
        }

        if (file == null || file.isEmpty()) {
            throw new ValidationFailedException("error.bug.attachment.file.required");
        }

        if (file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()) {
            throw new ValidationFailedException("error.bug.attachment.filename.blank");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationFailedException(
                    "error.bug.attachment.file.size.exceeded",
                    new Object[]{MAX_FILE_SIZE / (1024 * 1024)} // Pass size limit as param
            );
        }

        log.debug("✅ BugAttachmentValidator passed for bugId={}, file={}", bugId, file.getOriginalFilename());
    }
}
