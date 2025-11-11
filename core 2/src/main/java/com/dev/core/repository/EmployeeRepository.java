package com.dev.core.repository;

import com.dev.core.domain.Employee;
import com.dev.core.constants.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmail(String email);

    boolean existsByEmailAndOrganizationId(String email, Long organizationId);

    boolean existsByEmailAndIdNot(String email, Long id);

    List<Employee> findByOrganizationId(Long organizationId);

    List<Employee> findByOrganizationIdAndDepartment_Id(Long organizationId, Long departmentId);

    List<Employee> findByOrganizationIdAndStatus(Long organizationId, EmployeeStatus status);
}
