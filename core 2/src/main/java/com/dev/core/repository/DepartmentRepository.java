package com.dev.core.repository;

import com.dev.core.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long>, JpaSpecificationExecutor<Department> {

    boolean existsByNameAndOrganizationId(String name, Long organizationId);

    List<Department> findByOrganizationId(Long organizationId);
}
