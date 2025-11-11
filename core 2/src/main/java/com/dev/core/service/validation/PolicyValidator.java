package com.dev.core.service.validation;


import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.PolicyDTO;
import com.dev.core.repository.PolicyRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PolicyValidator {

    private final PolicyRepository policyRepository;

    public void validateBeforeCreate(PolicyDTO dto) {
        if (dto.getOrganizationId() == null)
            throw new BaseException("error.policy.organization.required");
        if (dto.getRole() == null || dto.getResource() == null || dto.getAction() == null)
            throw new BaseException("error.policy.fields.required");
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null || !policyRepository.existsById(id))
            throw new BaseException("error.policy.not.found", new Object[]{id});
    }
}
