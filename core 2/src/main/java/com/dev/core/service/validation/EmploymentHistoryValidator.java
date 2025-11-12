package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.EmploymentHistoryDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.EmploymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmploymentHistoryValidator {

    private final EmployeeRepository employeeRepository;
    private final EmploymentHistoryRepository historyRepository;

    public void validateBeforeCreate(EmploymentHistoryDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.history.null");

        if (dto.getEmployeeId() == null)
            throw new ValidationFailedException("error.history.employee.required");

        if (!employeeRepository.existsById(dto.getEmployeeId()))
            throw new ValidationFailedException("error.employee.notfound", new Object[]{dto.getEmployeeId()});
    }

    public void validateBeforeDelete(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.history.id.required");

        if (!historyRepository.existsById(id))
            throw new ValidationFailedException("error.history.notfound", new Object[]{id});
    }
}
