package com.dev.core.service;


import com.dev.core.model.PolicyDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PolicyService {

    PolicyDTO createPolicy(PolicyDTO dto);

    PolicyDTO updatePolicy(Long id, PolicyDTO dto);

    void deletePolicy(Long id);

    PolicyDTO getPolicyById(Long id);

    List<PolicyDTO> getPoliciesByOrganization(Long organizationId);

    Page<PolicyDTO> searchPolicies(Long organizationId, String keyword, Pageable pageable);
}
