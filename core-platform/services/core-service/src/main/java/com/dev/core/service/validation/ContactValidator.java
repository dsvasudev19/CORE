package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.ContactRepository;
import com.dev.core.model.ContactDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class ContactValidator {

    private final ContactRepository contactRepository;
    private final MessageSource messageSource;

    public void validateForCreate(ContactDTO dto, Locale locale) {
        if (dto == null)
            throw new ValidationFailedException(getMessage("validation.contact.null", locale));

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException(getMessage("validation.organization.required", locale));

        if (dto.getName() == null || dto.getName().trim().isEmpty())
            throw new ValidationFailedException(getMessage("validation.contact.name.required", locale));

        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty())
            throw new ValidationFailedException(getMessage("validation.contact.email.required", locale));

        if (contactRepository.existsByOrganizationIdAndEmailIgnoreCase(dto.getOrganizationId(), dto.getEmail()))
            throw new ValidationFailedException(getMessage("validation.contact.email.duplicate", locale));
    }

    public void validateForUpdate(Long id, ContactDTO dto, Locale locale) {
        if (id == null)
            throw new ValidationFailedException(getMessage("validation.contact.id.required", locale));

        if (!contactRepository.existsById(id))
            throw new ValidationFailedException(getMessage("validation.contact.notfound", locale));

        validateForCreate(dto, locale);
    }

    private String getMessage(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
    }
}
