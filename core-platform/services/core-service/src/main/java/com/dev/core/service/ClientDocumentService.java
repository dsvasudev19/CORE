package com.dev.core.service;

import com.dev.core.model.ClientDocumentDTO;
import java.util.List;

public interface ClientDocumentService {

    ClientDocumentDTO addDocument(ClientDocumentDTO dto);

    ClientDocumentDTO updateDocument(Long id, ClientDocumentDTO dto);

    void deactivateDocument(Long id);

    void activateDocument(Long id);

    ClientDocumentDTO getDocumentById(Long id);

    List<ClientDocumentDTO> getDocumentsByClient(Long clientId);

    List<ClientDocumentDTO> getAllDocuments(Long organizationId);

    boolean existsByFileId(String fileId);
}