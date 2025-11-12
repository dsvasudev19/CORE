package com.dev.core.service.validation;


import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ProjectFileDTO;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ProjectFileValidator {

    public void validateBeforeUpload(Long projectId, MultipartFile file, String visibility) {
        if (projectId == null || projectId <= 0) {
            throw new ValidationFailedException("Project ID is required for file upload");
        }
        if (file == null || file.isEmpty()) {
            throw new ValidationFailedException("File cannot be empty");
        }
        if (!StringUtils.hasText(visibility)) {
            throw new ValidationFailedException("File visibility must be specified");
        }
    }

    public void validateBeforeDelete(Long id) {
        if (id == null || id <= 0) {
            throw new ValidationFailedException("Valid File ID is required for deletion");
        }
    }

    public void validateBeforeGet(Long id) {
        if (id == null || id <= 0) {
            throw new ValidationFailedException("Valid File ID is required");
        }
    }

    public void validateDTO(ProjectFileDTO dto) {
        if (dto == null) {
            throw new ValidationFailedException("File DTO cannot be null");
        }
        if (dto.getProjectId() == null) {
            throw new ValidationFailedException("Project ID is required");
        }
        if (!StringUtils.hasText(dto.getOriginalFilename())) {
            throw new ValidationFailedException("Original filename cannot be blank");
        }
        if (!StringUtils.hasText(dto.getStoredPath())) {
            throw new ValidationFailedException("Stored path cannot be blank");
        }
    }
}
