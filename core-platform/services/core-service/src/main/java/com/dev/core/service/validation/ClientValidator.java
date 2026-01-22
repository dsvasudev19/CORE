package com.dev.core.service.validation;

import com.dev.core.domain.Client;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.ClientRepository;
import com.dev.core.model.ClientDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClientValidator {

    private final ClientRepository clientRepository;
    private final MessageSource messageSource;

    public void validateForCreate(ClientDTO dto, Locale locale) {
        if (dto == null)
            throw new ValidationFailedException(getMessage("validation.client.null", locale));

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException(getMessage("validation.organization.required", locale));

        if (dto.getName() == null || dto.getName().trim().isEmpty())
            throw new ValidationFailedException(getMessage("validation.client.name.required", locale));

        if (dto.getCode() == null || dto.getCode().trim().isEmpty())
            throw new ValidationFailedException(getMessage("validation.client.code.required", locale));

        if (clientRepository.existsByOrganizationIdAndCode(dto.getOrganizationId(), dto.getCode()))
            throw new ValidationFailedException(getMessage("validation.client.code.duplicate", locale));

        if (clientRepository.existsByOrganizationIdAndNameIgnoreCase(dto.getOrganizationId(), dto.getName()))
            throw new ValidationFailedException(getMessage("validation.client.name.duplicate", locale));
    }

    public void validateForUpdate(Long clientId, ClientDTO dto, Locale locale) {
        if (clientId == null)
            throw new ValidationFailedException(getMessage("validation.client.id.required", locale));

        Optional<Client> existing = clientRepository.findById(clientId);
        if (existing.isEmpty())
            throw new ValidationFailedException(getMessage("validation.client.notfound", locale));

        validateForCreate(dto, locale); // reuse same checks for duplicates
    }

    private String getMessage(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
    }
}
