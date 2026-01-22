package com.dev.core.service;

import com.dev.core.model.ClientDTO;
import java.util.List;

public interface ClientService {

    ClientDTO createClient(ClientDTO dto);                    // supports nested docs + reps

    ClientDTO updateClient(Long id, ClientDTO dto);            // full sync of nested data

    void deactivateClient(Long id);

    void activateClient(Long id);

    ClientDTO getClientById(Long id);                          // flat

    ClientDTO getClientDetailed(Long id);                      // with full nested data

    List<ClientDTO> getAllActiveClients(Long organizationId);

    List<ClientDTO> searchClients(Long organizationId, String keyword);

    boolean existsByCodeOrName(Long organizationId, String code, String name);
}