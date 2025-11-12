package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.EmployeeDocumentDTO;
import com.dev.core.repository.EmployeeDocumentRepository;
import com.dev.core.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmployeeDocumentValidator {

    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentRepository documentRepository;

    public void validateBeforeUpload(EmployeeDocumentDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.document.null");

        if (dto.getEmployeeId() == null)
            throw new ValidationFailedException("error.document.employee.required");

        if (!employeeRepository.existsById(dto.getEmployeeId()))
            throw new ValidationFailedException("error.employee.notfound", new Object[]{dto.getEmployeeId()});

        if (dto.getDocumentName() == null || dto.getDocumentName().isBlank())
            throw new ValidationFailedException("error.document.name.required");
    }

    public void validateBeforeDelete(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.document.id.required");

        if (!documentRepository.existsById(id))
            throw new ValidationFailedException("error.document.notfound", new Object[]{id});
    }
}
