package com.dev.core.service.impl;

import com.dev.core.domain.Client;
import com.dev.core.domain.ClientRepresentative;
import com.dev.core.domain.Contact;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ClientRepresentativeMapper;
import com.dev.core.model.ClientRepresentativeDTO;
import com.dev.core.repository.ClientRepresentativeRepository;
import com.dev.core.repository.ClientRepository;
import com.dev.core.repository.ContactRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ClientRepresentativeService;
import com.dev.core.service.validation.ClientRepresentativeValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientRepresentativeServiceImpl implements ClientRepresentativeService {

    private final ClientRepresentativeRepository representativeRepository;
    private final ClientRepository clientRepository;
    private final ContactRepository contactRepository;
    private final ClientRepresentativeValidator representativeValidator;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        String resource = "CLIENTREPRESENTATIVE";
        authorizationService.authorize(resource, action);
    }

    @Override
    public ClientRepresentativeDTO addRepresentative(ClientRepresentativeDTO dto) {
        authorize("CREATE");
        representativeValidator.validateForCreate(dto, java.util.Locale.getDefault());

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{dto.getClientId()}));
        Contact contact = contactRepository.findById(dto.getContactId())
                .orElseThrow(() -> new BaseException("error.contact.not.found", new Object[]{dto.getContactId()}));

        ClientRepresentative entity = ClientRepresentativeMapper.toEntity(dto, null, client, contact);
        ClientRepresentative saved = representativeRepository.save(entity);
        return ClientRepresentativeMapper.toDTO(saved);
    }

    @Override
    public ClientRepresentativeDTO updateRepresentative(Long id, ClientRepresentativeDTO dto) {
        authorize("UPDATE");
        representativeValidator.validateForUpdate(id, dto, java.util.Locale.getDefault());

        ClientRepresentative existing = representativeRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.rep.not.found", new Object[]{id}));

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{dto.getClientId()}));
        Contact contact = contactRepository.findById(dto.getContactId())
                .orElseThrow(() -> new BaseException("error.contact.not.found", new Object[]{dto.getContactId()}));

        ClientRepresentativeMapper.toEntity(dto, existing, client, contact);
        ClientRepresentative updated = representativeRepository.save(existing);
        return ClientRepresentativeMapper.toDTO(updated);
    }

    @Override
    public void deactivateRepresentative(Long id) {
        authorize("DELETE");
        if (id == null) throw new BaseException("error.rep.id.required");
        ClientRepresentative existing = representativeRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.rep.not.found", new Object[]{id}));
        existing.setActive(false);
        representativeRepository.save(existing);
    }

    @Override
    public void activateRepresentative(Long id) {
        authorize("UPDATE");
        if (id == null) throw new BaseException("error.rep.id.required");
        ClientRepresentative existing = representativeRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.rep.not.found", new Object[]{id}));
        existing.setActive(true);
        representativeRepository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientRepresentativeDTO getRepresentativeById(Long id) {
        authorize("READ");
        return representativeRepository.findById(id)
                .map(ClientRepresentativeMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.rep.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientRepresentativeDTO> getRepresentativesByClient(Long clientId) {
        authorize("READ");
        return representativeRepository.findByOrganizationIdAndClientIdAndActiveTrue(null, clientId)
                // note: repository method requires organizationId. If you want org-scoped, pass orgId; here we assume upper layer provides proper org scoping.
                .stream().map(ClientRepresentativeMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientRepresentativeDTO> getAllRepresentatives(Long organizationId) {
        authorize("READ");
        return representativeRepository.findByOrganizationIdAndActiveTrue(organizationId)
                .stream().map(ClientRepresentativeMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClientRepresentativeDTO getPrimaryRepresentative(Long clientId) {
        authorize("READ");
        ClientRepresentative rep = representativeRepository.findByClientIdAndPrimaryContactTrue(clientId)
                .orElseThrow(() -> new BaseException("error.rep.primary.not.found", new Object[]{clientId}));
        return ClientRepresentativeMapper.toDTO(rep);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isContactLinkedToClient(Long clientId, Long contactId) {
        authorize("READ");
        return representativeRepository.existsByClientIdAndContactId(clientId, contactId);
    }
}
