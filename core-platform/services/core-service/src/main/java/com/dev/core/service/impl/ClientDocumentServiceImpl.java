package com.dev.core.service.impl;

import com.dev.core.domain.Client;
import com.dev.core.domain.ClientDocument;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ClientDocumentMapper;
import com.dev.core.model.ClientDocumentDTO;
import com.dev.core.repository.ClientDocumentRepository;
import com.dev.core.repository.ClientRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ClientDocumentService;
import com.dev.core.service.validation.ClientDocumentValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientDocumentServiceImpl implements ClientDocumentService {

    private final ClientDocumentRepository documentRepository;
    private final ClientRepository clientRepository;
    private final ClientDocumentValidator documentValidator;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        String resource = "CLIENT_DOCUMENT";
        authorizationService.authorize(resource, action);
    }

    @Override
    public ClientDocumentDTO addDocument(ClientDocumentDTO dto) {
        authorize("CREATE");
        documentValidator.validateForCreate(dto, java.util.Locale.getDefault());

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{dto.getClientId()}));

        ClientDocument entity = ClientDocumentMapper.toEntity(dto, client);
        // uploadedBy can be set from security context if needed
        // entity.setUploadedBy(currentUserId);

        ClientDocument saved = documentRepository.save(entity);
        return ClientDocumentMapper.toDTO(saved);
    }

    @Override
    public ClientDocumentDTO updateDocument(Long id, ClientDocumentDTO dto) {
        authorize("UPDATE");
        documentValidator.validateForUpdate(id, dto, java.util.Locale.getDefault());

        ClientDocument existing = documentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{dto.getClientId()}));

        ClientDocumentMapper.updateEntityFromDTO(dto, existing, client);

        ClientDocument updated = documentRepository.save(existing);
        return ClientDocumentMapper.toDTO(updated);
    }

    @Override
    public void deactivateDocument(Long id) {
        authorize("DELETE");
        if (id == null) throw new BaseException("error.document.id.required");

        ClientDocument existing = documentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));

        existing.setActive(false);
        documentRepository.save(existing);
    }

    @Override
    public void activateDocument(Long id) {
        authorize("UPDATE");
        if (id == null) throw new BaseException("error.document.id.required");

        ClientDocument existing = documentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));

        existing.setActive(true);
        documentRepository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientDocumentDTO getDocumentById(Long id) {
        authorize("READ");
        return documentRepository.findById(id)
                .map(ClientDocumentMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDocumentDTO> getDocumentsByClient(Long clientId) {
        authorize("READ");
        return documentRepository.findByClientIdAndActiveTrue(clientId)
                .stream()
                .map(ClientDocumentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDocumentDTO> getAllDocuments(Long organizationId) {
        authorize("READ");
        return documentRepository.findByOrganizationIdAndActiveTrue(organizationId)
                .stream()
                .map(ClientDocumentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByFileId(String fileId) {
        authorize("READ");
        return documentRepository.existsByFileId(fileId);
    }
}