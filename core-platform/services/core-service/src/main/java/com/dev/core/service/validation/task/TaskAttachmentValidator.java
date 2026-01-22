package com.dev.core.service.validation.task;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.task.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
public class TaskAttachmentValidator {

    private final TaskRepository taskRepository;

    public void validateBeforeUpload(Long taskId, MultipartFile file, String visibility) {
        if (taskId == null || !taskRepository.existsById(taskId)) {
            throw new ValidationFailedException("Invalid task ID for attachment upload");
        }

        if (file == null || file.isEmpty()) {
            throw new ValidationFailedException("File is required for upload");
        }

        if (file.getSize() > 25 * 1024 * 1024) { // 25 MB
            throw new ValidationFailedException("File size exceeds 25MB limit");
        }

        if (visibility == null || visibility.isBlank()) {
            throw new ValidationFailedException("File visibility is required");
        }
    }

    public void validateBeforeDelete(Long attachmentId) {
        if (attachmentId == null || attachmentId <= 0) {
            throw new ValidationFailedException("Invalid attachment ID for deletion");
        }
    }
}
