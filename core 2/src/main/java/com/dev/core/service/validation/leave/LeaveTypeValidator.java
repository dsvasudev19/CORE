

package com.dev.core.service.validation.leave;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.leave.LeaveTypeDTO;
import com.dev.core.repository.leave.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaveTypeValidator {

    private final LeaveTypeRepository leaveTypeRepository;

    public void validateBeforeCreate(LeaveTypeDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.leaveType.null", null);

        if (dto.getName() == null || dto.getName().isBlank())
            throw new ValidationFailedException("error.leaveType.name.required", null);

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException("error.leaveType.org.required", null);

        if (leaveTypeRepository.existsByOrganizationIdAndName(
                dto.getOrganizationId(), dto.getName()))
            throw new ValidationFailedException(
                    "error.leaveType.name.exists",
                    new Object[]{dto.getName()}
            );
    }

    public void validateBeforeUpdate(Long id, LeaveTypeDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.leaveType.id.required", null);

        if (!leaveTypeRepository.existsById(id))
            throw new ValidationFailedException("error.leaveType.notfound", new Object[]{id});

        validateBeforeCreate(dto); // reuse checks except unique constraint
        
        // However: skip unique for same ID
    }
}
