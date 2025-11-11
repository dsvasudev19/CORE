package com.dev.core.repository;

import com.dev.core.domain.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long>, JpaSpecificationExecutor<Designation> {

    boolean existsByTitleAndOrganizationId(String title, Long organizationId);

    List<Designation> findByOrganizationId(Long organizationId);
}
