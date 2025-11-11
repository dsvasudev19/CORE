package com.dev.core.service;

import com.dev.core.model.ClientRepresentativeDTO;
import java.util.List;

public interface ClientRepresentativeService {

    /**
     * Add a representative (contact) for a given client.
     */
    ClientRepresentativeDTO addRepresentative(ClientRepresentativeDTO dto);

    /**
     * Update representative role or details.
     */
    ClientRepresentativeDTO updateRepresentative(Long id, ClientRepresentativeDTO dto);

    /**
     * Remove (soft delete) a representative.
     */
    void deactivateRepresentative(Long id);

    /**
     * Reactivate representative.
     */
    void activateRepresentative(Long id);

    /**
     * Get representative by ID.
     */
    ClientRepresentativeDTO getRepresentativeById(Long id);

    /**
     * Get all representatives for a given client.
     */
    List<ClientRepresentativeDTO> getRepresentativesByClient(Long clientId);

    /**
     * Get all representatives for an organization.
     */
    List<ClientRepresentativeDTO> getAllRepresentatives(Long organizationId);

    /**
     * Get the primary contact for a client (if exists).
     */
    ClientRepresentativeDTO getPrimaryRepresentative(Long clientId);

    /**
     * Check if a given contact is already linked to a client.
     */
    boolean isContactLinkedToClient(Long clientId, Long contactId);
}
