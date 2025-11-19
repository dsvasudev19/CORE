package com.dev.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long>, JpaSpecificationExecutor<Department> {

    boolean existsByNameAndOrganizationId(String name, Long organizationId);

    List<Department> findByOrganizationId(Long organizationId);
    
    Optional<Department> findByCode(String code);
}
