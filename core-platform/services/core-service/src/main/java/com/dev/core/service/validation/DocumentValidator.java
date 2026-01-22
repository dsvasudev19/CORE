package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.DocumentRepository;
import com.dev.core.model.DocumentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class DocumentValidator {

    private final DocumentRepository documentRepository;
    private final MessageSource messageSource;

    public void validateForCreate(DocumentDTO dto, Locale locale) {
        if (dto == null)
            throw new ValidationFailedException(getMessage("validation.document.null", locale));

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException(getMessage("validation.organization.required", locale));

        if (dto.getEntityType() == null || dto.getEntityType().isBlank())
            throw new ValidationFailedException(getMessage("validation.document.entitytype.required", locale));

        if (dto.getEntityId() == null)
            throw new ValidationFailedException(getMessage("validation.document.entityid.required", locale));

        if (dto.getFileId() == null || dto.getFileId().isBlank())
            throw new ValidationFailedException(getMessage("validation.document.fileid.required", locale));

        if (dto.getTitle() == null || dto.getTitle().isBlank())
            throw new ValidationFailedException(getMessage("validation.document.title.required", locale));
    }

    public void validateForUpdate(Long id, DocumentDTO dto, Locale locale) {
        if (id == null)
            throw new ValidationFailedException(getMessage("validation.document.id.required", locale));

        if (!documentRepository.existsById(id))
            throw new ValidationFailedException(getMessage("validation.document.notfound", locale));

        validateForCreate(dto, locale);
    }

    private String getMessage(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
    }
}
