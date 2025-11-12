package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Component
public class BugAttachmentValidator {

    public void validateBeforeUpload(Long bugId, MultipartFile file) {
        if (bugId == null)
            throw new ValidationFailedException("Bug ID is required for uploading attachments");

        if (file == null || file.isEmpty())
            throw new ValidationFailedException("Attachment file is missing");

        if (file.getOriginalFilename() == null || file.getOriginalFilename().isBlank())
            throw new ValidationFailedException("Attachment file name cannot be blank");

        if (file.getSize() > 10 * 1024 * 1024)
            throw new ValidationFailedException("Attachment file size cannot exceed 10 MB");
    }
}
