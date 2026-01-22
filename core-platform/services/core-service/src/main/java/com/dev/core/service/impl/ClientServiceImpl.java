package com.dev.core.service.impl;

import com.dev.core.domain.*;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.*;
import com.dev.core.model.*;
import com.dev.core.repository.*;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ClientService;
import com.dev.core.service.validation.ClientValidator;
import com.dev.core.specification.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientDocumentRepository documentRepository;
    private final ClientRepresentativeRepository representativeRepository;
    private final ContactRepository contactRepository;

    private final ClientValidator clientValidator;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        authorizationService.authorize("CLIENT", action);
    }

    @Override
    public ClientDTO createClient(ClientDTO dto) {
        authorize("CREATE");
        clientValidator.validateForCreate(dto, java.util.Locale.getDefault());

        Client entity = new Client();
        ClientMapper.updateEntityFromDTO(dto, entity);
        entity.setOrganizationId(dto.getOrganizationId());

        syncDocuments(entity, dto.getDocuments());
        syncRepresentatives(entity, dto.getRepresentatives());

        Client saved = clientRepository.save(entity);
        return ClientMapper.toDetailedDTO(saved);
    }

    @Override
    public ClientDTO updateClient(Long id, ClientDTO dto) {
        authorize("UPDATE");
        clientValidator.validateForUpdate(id, dto, java.util.Locale.getDefault());

        Client entity = clientRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));

        ClientMapper.updateEntityFromDTO(dto, entity);

        syncDocuments(entity, dto.getDocuments());
        syncRepresentatives(entity, dto.getRepresentatives());

        Client updated = clientRepository.save(entity);
        return ClientMapper.toDetailedDTO(updated);
    }

    // ==================== Collection Synchronization ====================

    private void syncDocuments(Client client, List<ClientDocumentDTO> documentDtos) {
        if (documentDtos == null) {
            client.getDocuments().clear();
            return;
        }

        Set<Long> incomingIds = documentDtos.stream()
                .filter(d -> d.getId() != null)
                .map(ClientDocumentDTO::getId)
                .collect(Collectors.toSet());

        // Remove missing
        client.getDocuments().removeIf(doc -> !incomingIds.contains(doc.getId()));

        // Add or update
        for (ClientDocumentDTO dto : documentDtos) {
            ClientDocument doc;
            if (dto.getId() == null) {
                doc = ClientDocumentMapper.toEntity(dto, client);
            } else {
                doc = client.getDocuments().stream()
                        .filter(d -> d.getId().equals(dto.getId()))
                        .findFirst()
                        .orElseThrow(() -> new BaseException("error.document.not.found", new Object[]{dto.getId()}));
                ClientDocumentMapper.updateEntityFromDTO(dto, doc, client);
            }
            client.getDocuments().add(doc);
        }
    }

    private void syncRepresentatives(Client client, List<ClientRepresentativeDTO> repDtos) {
        if (repDtos == null) {
            client.getRepresentatives().clear();
            return;
        }

        Set<Long> incomingIds = repDtos.stream()
                .filter(r -> r.getId() != null)
                .map(ClientRepresentativeDTO::getId)
                .collect(Collectors.toSet());

        // Remove missing
        client.getRepresentatives().removeIf(rep -> !incomingIds.contains(rep.getId()));

        // Track primary change
        boolean hasNewPrimary = repDtos.stream().anyMatch(ClientRepresentativeDTO::isPrimaryContact);

        // Add or update
        for (ClientRepresentativeDTO dto : repDtos) {
            Contact contact = contactRepository.findById(dto.getContactId())
                    .orElseThrow(() -> new BaseException("error.contact.not.found", new Object[]{dto.getContactId()}));

            ClientRepresentative rep;
            if (dto.getId() == null) {
                rep = ClientRepresentativeMapper.toEntity(dto,  client, contact);
            } else {
                rep = client.getRepresentatives().stream()
                        .filter(r -> r.getId().equals(dto.getId()))
                        .findFirst()
                        .orElseThrow(() -> new BaseException("error.rep.not.found", new Object[]{dto.getId()}));
                ClientRepresentativeMapper.updateEntityFromDTO(dto, rep, client, contact);
            }

            // Auto-demote others if this is primary
            if (dto.isPrimaryContact() && hasNewPrimary) {
                client.getRepresentatives().stream()
                        .filter(r -> !r.equals(rep))
                        .forEach(r -> r.setPrimaryContact(false));
            }

            client.getRepresentatives().add(rep);
        }
    }

    // ==================== Basic CRUD ====================

    @Override
    public void deactivateClient(Long id) {
        authorize("DELETE");
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));
        client.setActive(false);
        clientRepository.save(client);
    }

    @Override
    public void activateClient(Long id) {
        authorize("UPDATE");
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));
        client.setActive(true);
        clientRepository.save(client);
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
    public ClientDTO getClientDetailed(Long id) {
        authorize("READ");

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.client.not.found", new Object[]{id}));

        // Load lazy collections
        client.getDocuments().size();
        client.getRepresentatives().size();

        // Print full data
        printClientDebug(client);

        return ClientMapper.toDetailedDTO(client);
    }


    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> getAllActiveClients(Long organizationId) {
        authorize("READ");
        return clientRepository.findByOrganizationIdAndActiveTrue(organizationId)
                .stream()
                .map(ClientMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> searchClients(Long organizationId, String keyword) {
        authorize("READ");

        Page<Client> page = clientRepository.findAll(
                SpecificationBuilder.of(Client.class)
                        .equals("organizationId", organizationId)
                        .contains("name", keyword)
                        .contains("code", keyword)
                        .contains("industry", keyword)
                        .build(),
                Pageable.unpaged()
        );

        return page.map(ClientMapper::toDTO).toList();
    }
    
    private void printClientDebug(Client client) {
        System.out.println("\n========= CLIENT FULL DATA =========");

        // Basic fields
        System.out.println("ID: " + client.getId());
        System.out.println("Name: " + client.getName());
        System.out.println("Code: " + client.getCode());
        System.out.println("Domain: " + client.getDomain());
        System.out.println("Address: " + client.getAddress());
        System.out.println("Country: " + client.getCountry());
        System.out.println("Industry: " + client.getIndustry());
        System.out.println("Status: " + client.getStatus());
        System.out.println("Description: " + client.getDescription());
        System.out.println("Created At: " + client.getCreatedAt());
        System.out.println("Updated At: " + client.getUpdatedAt());

        // ------------------------------
        // DOCUMENTS
        // ------------------------------
        System.out.println("\n--- Documents (" + client.getDocuments().size() + ") ---");

        for (ClientDocument doc : client.getDocuments()) {
            System.out.println("  • Document ID: " + doc.getId());
            System.out.println("      fileId: " + doc.getFileId());
            System.out.println("      title: " + doc.getTitle());
            System.out.println("      category: " + doc.getCategory());
            System.out.println("      uploadedBy: " + doc.getUploadedBy());
            System.out.println("      description: " + doc.getDescription());
            System.out.println("      createdAt: " + doc.getCreatedAt());
        }

        // ------------------------------
        // REPRESENTATIVES
        // ------------------------------
        System.out.println("\n--- Representatives (" + client.getRepresentatives().size() + ") ---");

        for (ClientRepresentative rep : client.getRepresentatives()) {
            System.out.println("  • Representative ID: " + rep.getId());
            System.out.println("      role: " + rep.getRole());
            System.out.println("      primaryContact: " + rep.isPrimaryContact());
            System.out.println("      createdAt: " + rep.getCreatedAt());

            // Contact info inside representative
            if (rep.getContact() != null) {
                Contact contact = rep.getContact();
                System.out.println("      Contact:");
                System.out.println("         ID: " + contact.getId());
                System.out.println("         Name: " + contact.getName());
                System.out.println("         Email: " + contact.getEmail());
                System.out.println("         Phone: " + contact.getPhone());
                System.out.println("         Department: " + contact.getDepartment());
                System.out.println("         Title: " + contact.getName());
            }
        }

        System.out.println("====================================\n");
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