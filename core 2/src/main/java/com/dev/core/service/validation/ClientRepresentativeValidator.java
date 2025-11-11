package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.ClientRepository;
import com.dev.core.repository.ContactRepository;
import com.dev.core.repository.ClientRepresentativeRepository;
import com.dev.core.model.ClientRepresentativeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class ClientRepresentativeValidator {

    private final ClientRepository clientRepository;
    private final ContactRepository contactRepository;
    private final ClientRepresentativeRepository representativeRepository;
    private final MessageSource messageSource;

    public void validateForCreate(ClientRepresentativeDTO dto, Locale locale) {
        if (dto == null)
            throw new ValidationFailedException(getMessage("validation.rep.null", locale));

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException(getMessage("validation.organization.required", locale));

        if (dto.getClientId() == null)
            throw new ValidationFailedException(getMessage("validation.rep.client.required", locale));

        if (dto.getContactId() == null)
            throw new ValidationFailedException(getMessage("validation.rep.contact.required", locale));

        if (!clientRepository.existsById(dto.getClientId()))
            throw new ValidationFailedException(getMessage("validation.client.notfound", locale));

        if (!contactRepository.existsById(dto.getContactId()))
            throw new ValidationFailedException(getMessage("validation.contact.notfound", locale));

        if (representativeRepository.existsByClientIdAndContactId(dto.getClientId(), dto.getContactId()))
            throw new ValidationFailedException(getMessage("validation.rep.duplicate.link", locale));
    }

    public void validateForUpdate(Long id, ClientRepresentativeDTO dto, Locale locale) {
        if (id == null)
            throw new ValidationFailedException(getMessage("validation.rep.id.required", locale));

        if (!representativeRepository.existsById(id))
            throw new ValidationFailedException(getMessage("validation.rep.notfound", locale));

        validateForCreate(dto, locale);
    }

    private String getMessage(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
    }
}
