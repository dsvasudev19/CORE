package com.dev.core.service;

import com.dev.core.model.EmployeeDocumentDTO;

import java.util.List;

public interface EmployeeDocumentService {

    EmployeeDocumentDTO uploadDocument(EmployeeDocumentDTO dto);

    void deleteDocument(Long id);

    EmployeeDocumentDTO getDocumentById(Long id);

    List<EmployeeDocumentDTO> getDocumentsByEmployee(Long employeeId);

    void markVerified(Long documentId, boolean verified);
}
