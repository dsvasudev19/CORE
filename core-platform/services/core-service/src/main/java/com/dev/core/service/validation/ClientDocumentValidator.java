package com.dev.core.service.validation;

import com.dev.core.exception.BaseException;
import com.dev.core.model.ClientDocumentDTO;
import com.dev.core.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class ClientDocumentValidator {

    private final MessageSource messageSource;
    private final ClientRepository clientRepository;

    public void validateForCreate(ClientDocumentDTO dto, Locale locale) {
        commonValidation(dto, locale);

        // fileId must be present and unique on create
        if (!StringUtils.hasText(dto.getFileId())) {
            throw new BaseException("error.document.fileId.required");
        }

        // Title is mandatory
        if (!StringUtils.hasText(dto.getTitle())) {
            throw new BaseException("error.document.title.required");
        }

        // Client must exist and belong to the same organization
        validateClient(dto.getClientId(), dto.getOrganizationId(), locale);
    }

    public void validateForUpdate(Long id, ClientDocumentDTO dto, Locale locale) {
        if (id == null) {
            throw new BaseException("error.document.id.required");
        }

        if (dto == null) {
            throw new BaseException("error.document.dto.required");
        }

        commonValidation(dto, locale);

        // On update, clientId should not change (security best practice)
        // You can relax this if business allows reassignment
        validateClient(dto.getClientId(), dto.getOrganizationId(), locale);
    }

    private void commonValidation(ClientDocumentDTO dto, Locale locale) {
        if (dto == null) {
            throw new BaseException("error.document.dto.null");
        }

        if (dto.getClientId() == null) {
            throw new BaseException("error.document.clientId.required");
        }

//        if (dto.getOrganizationId() == null) {
//            throw new BaseException("error.organization.id.required");
//        }

        // Category can be optional, but if provided — trim and validate length if needed
        if (StringUtils.hasText(dto.getCategory())) {
            dto.setCategory(dto.getCategory().trim());
        }

        if (StringUtils.hasText(dto.getDescription()) && dto.getDescription().length() > 1000) {
            throw new BaseException("error.document.description.too.long");
        }
    }

    private void validateClient(Long clientId, Long organizationId, Locale locale) {
        clientRepository.findByIdAndOrganizationIdAndActiveTrue(clientId, organizationId)
                .orElseThrow(() -> new BaseException("error.client.not.found.or.inactive", new Object[]{clientId}));
    }
}