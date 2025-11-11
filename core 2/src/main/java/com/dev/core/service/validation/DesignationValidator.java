package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.DesignationDTO;
import com.dev.core.repository.DesignationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DesignationValidator {

    private final DesignationRepository designationRepository;

    public void validateBeforeCreate(DesignationDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.designation.null", "Designation data cannot be null");

        if (dto.getTitle() == null || dto.getTitle().isBlank())
            throw new ValidationFailedException("error.designation.title.required", "Title is required");

        boolean exists = designationRepository.existsByTitleAndOrganizationId(dto.getTitle(), dto.getOrganizationId());
        if (exists)
            throw new ValidationFailedException("error.designation.title.exists", new Object[]{dto.getTitle()});
    }

    public void validateBeforeUpdate(Long id, DesignationDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.designation.id.required", "Designation ID is required");

        if (!designationRepository.existsById(id))
            throw new ValidationFailedException("error.designation.notfound", new Object[]{id});
    }

    public void validateBeforeDelete(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.designation.id.required", "Designation ID is required");

        if (!designationRepository.existsById(id))
            throw new ValidationFailedException("error.designation.notfound", new Object[]{id});
    }
}
