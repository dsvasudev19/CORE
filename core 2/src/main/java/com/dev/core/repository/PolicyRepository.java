package com.dev.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.Policy;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long>, JpaSpecificationExecutor<Policy> {

    List<Policy> findAllByOrganizationId(Long organizationId);
    
    boolean existsByRoleIdAndResourceIdAndActionId(long roleId,long resourceId,long actoinId);

    List<Policy> findByRole_IdAndOrganizationId(Long roleId, Long organizationId);

    Page<Policy> findAllByOrganizationId(Long organizationId, Pageable pageable);

    Page<Policy> findByOrganizationIdAndDescriptionContainingIgnoreCase(Long organizationId, String description, Pageable pageable);
    
    boolean existsByUserIdAndResourceIdAndActionId(long userId, long resourceId, long actionId);

    List<Policy> findAllByRoleIdAndResourceIdAndActionId(long roleId, long resourceId, long actionId);

    List<Policy> findAllByUserIdAndResourceIdAndActionId(long userId, long resourceId, long actionId);

}
	