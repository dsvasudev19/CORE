package com.dev.core.service;

import com.dev.core.model.ClientDTO;
import java.util.List;

public interface ClientService {

    /**
     * Create a new client under an organization.
     */
    ClientDTO createClient(ClientDTO dto);

    /**
     * Update an existing client’s information.
     */
    ClientDTO updateClient(Long id, ClientDTO dto);

    /**
     * Soft delete or deactivate a client.
     */
    void deactivateClient(Long id);

    /**
     * Reactivate a previously deactivated client.
     */
    void activateClient(Long id);

    /**
     * Get a client by its ID (scoped by organization).
     */
    ClientDTO getClientById(Long id);

    /**
     * Get all active clients for the given organization.
     */
    List<ClientDTO> getAllActiveClients(Long organizationId);

    /**
     * Search clients by name, code, or industry.
     */
    List<ClientDTO> searchClients(Long organizationId, String keyword);

    /**
     * Check if client code or name already exists in an organization.
     */
    boolean existsByCodeOrName(Long organizationId, String code, String name);
}
