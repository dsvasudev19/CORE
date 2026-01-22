package com.dev.core.repository;

import com.dev.core.domain.EmployeeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeDocumentRepository extends JpaRepository<EmployeeDocument, Long>, JpaSpecificationExecutor<EmployeeDocument> {

    List<EmployeeDocument> findByEmployee_Id(Long employeeId);

    boolean existsByEmployee_IdAndDocumentName(Long employeeId, String documentName);
}
