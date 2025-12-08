

package com.dev.core.repository.leave;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.leave.LeaveType;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

    List<LeaveType> findByOrganizationId(Long organizationId);

    Optional<LeaveType> findByOrganizationIdAndId(Long organizationId, Long id);

    boolean existsByOrganizationIdAndName(Long organizationId, String name);

    List<LeaveType> findByOrganizationIdAndActiveTrue(Long organizationId);
}

