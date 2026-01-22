package com.dev.core.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dev.core.model.EmployeeDocumentDTO;

public interface EmployeeDocumentService {

    EmployeeDocumentDTO uploadDocument(EmployeeDocumentDTO dto);

    void deleteDocument(Long id);

    EmployeeDocumentDTO getDocumentById(Long id);

    List<EmployeeDocumentDTO> getDocumentsByEmployee(Long employeeId);

    void markVerified(Long documentId, boolean verified);
    
    EmployeeDocumentDTO uploadDocument(MultipartFile file, EmployeeDocumentDTO dto);

}
