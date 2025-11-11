package com.dev.core.service.validation;


import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.ActionDTO;
import com.dev.core.repository.ActionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ActionValidator {

    private final ActionRepository actionRepository;

    public void validateBeforeCreate(ActionDTO dto) {
        if (dto.getCode() == null || dto.getCode().isBlank())
            throw new BaseException("error.action.code.required");
        if (dto.getName() == null || dto.getName().isBlank())
            throw new BaseException("error.action.name.required");
        if (actionRepository.existsByCode(dto.getCode()))
            throw new BaseException("error.action.code.exists", new Object[]{dto.getCode()});
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null || !actionRepository.existsById(id))
            throw new BaseException("error.action.not.found", new Object[]{id});
    }
}
