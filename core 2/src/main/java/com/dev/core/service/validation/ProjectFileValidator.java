package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ProjectFileDTO;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ProjectFileValidator {

    public void validateBeforeUpload(Long projectId, MultipartFile file, String visibility) {
        if (projectId == null || projectId <= 0)
            throw new ValidationFailedException("error.projectfile.projectid.required");

        if (file == null || file.isEmpty())
            throw new ValidationFailedException("error.projectfile.file.empty");

        if (!StringUtils.hasText(visibility))
            throw new ValidationFailedException("error.projectfile.visibility.required");
    }

    public void validateBeforeDelete(Long id) {
        if (id == null || id <= 0)
            throw new ValidationFailedException("error.projectfile.id.required");
    }

    public void validateBeforeGet(Long id) {
        if (id == null || id <= 0)
            throw new ValidationFailedException("error.projectfile.id.required");
    }

    public void validateDTO(ProjectFileDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.projectfile.dto.null");

        if (dto.getProjectId() == null)
            throw new ValidationFailedException("error.projectfile.projectid.required");

        if (!StringUtils.hasText(dto.getOriginalFilename()))
            throw new ValidationFailedException("error.projectfile.filename.required");

        if (!StringUtils.hasText(dto.getStoredPath()))
            throw new ValidationFailedException("error.projectfile.path.required");
    }
}
