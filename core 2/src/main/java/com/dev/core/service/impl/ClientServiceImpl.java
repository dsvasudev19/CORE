package com.dev.core.service.impl;

import com.dev.core.domain.Client;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ClientMapper;
import com.dev.core.model.ClientDTO;
import com.dev.core.repository.ClientRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ClientService;
import com.dev.core.service.validation.ClientValidator;
import com.dev.core.specification.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientValidator clientValidator;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        String resource = "CLIENT";
        authorizationService.authorize(resource, action);
    }

    @Override
    public ClientDTO createClient(ClientDTO dto) {
        authorize("CREATE");
        clientValidator.validateForCreate(dto, java.util.Locale.getDefault());
        Client entity = ClientMapper.toEntity(dto, null);
        Client saved = clientRepository.save(entity);
        return ClientMapper.toDTO(saved);
    }

    @Override
    public ClientDTO updateClient(Long id, ClientDTO dto) {
        authorize("UPDATE");
        clientValidator.validateForUpdate(id, dto, java.util.Locale.getDefault());

        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));

        ClientMapper.toEntity(dto, existing); // updates setters
        Client updated = clientRepository.save(existing);
        return ClientMapper.toDTO(updated);
    }

    @Override
    public void deactivateClient(Long id) {
        authorize("DELETE");
        if (id == null) throw new BaseException("error.client.id.required");
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));
        existing.setActive(false);
        clientRepository.save(existing);
    }

    @Override
    public void activateClient(Long id) {
        authorize("UPDATE");
        if (id == null) throw new BaseException("error.client.id.required");
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));
        existing.setActive(true);
        clientRepository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientDTO getClientById(Long id) {
        authorize("READ");
        return clientRepository.findById(id)
                .map(ClientMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> getAllActiveClients(Long organizationId) {
        authorize("READ");
        return clientRepository.findByOrganizationIdAndActiveTrue(organizationId)
                .stream().map(ClientMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> searchClients(Long organizationId, String keyword) {
        authorize("READ");
        // If pagination required, use pageable overload (service interface currently returns List)
        Page<Client> page = clientRepository.findAll(
                SpecificationBuilder.of(Client.class)
                        .equals("organizationId", organizationId)
                     
                        .contains("name", keyword)
                        .contains("code", keyword)
                        .contains("industry", keyword)
                        .build(),
                Pageable.unpaged()
        );
        return page.map(ClientMapper::toDTO).stream().collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCodeOrName(Long organizationId, String code, String name) {
        authorize("READ");
        if (code != null && clientRepository.existsByOrganizationIdAndCode(organizationId, code)) return true;
        if (name != null && clientRepository.existsByOrganizationIdAndNameIgnoreCase(organizationId, name)) return true;
        return false;
    }
}
