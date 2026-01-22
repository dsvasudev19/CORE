package com.dev.core.repository;

import com.dev.core.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long>, JpaSpecificationExecutor<Team> {

    boolean existsByNameAndOrganizationId(String name, Long organizationId);

    List<Team> findByOrganizationId(Long organizationId);

    List<Team> findByOrganizationIdAndDepartment_Id(Long organizationId, Long departmentId);
}
