

package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.ActionDTO;
import com.dev.core.repository.ActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActionValidator {

    private final ActionRepository actionRepository;

    public void validateBeforeCreate(ActionDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.action.null", null);

        if (dto.getCode() == null || dto.getCode().isBlank())
            throw new ValidationFailedException("error.action.code.required", null);

        if (dto.getName() == null || dto.getName().isBlank())
            throw new ValidationFailedException("error.action.name.required", null);

        if (actionRepository.existsByCode(dto.getCode()))
            throw new ValidationFailedException("error.action.code.exists", new Object[]{dto.getCode()});
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.action.id.required", null);

        if (!actionRepository.existsById(id))
            throw new ValidationFailedException("error.action.notfound", new Object[]{id});
    }
}
