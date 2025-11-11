//package com.dev.core.service.impl;
//
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.Policy;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.PolicyMapper;
//import com.dev.core.model.PolicyDTO;
//import com.dev.core.repository.PolicyRepository;
//import com.dev.core.service.PolicyService;
//import com.dev.core.service.validation.PolicyValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class PolicyServiceImpl implements PolicyService {
//
//    private final PolicyRepository policyRepository;
//    private final PolicyValidator policyValidator;
//
//    @Override
//    public PolicyDTO createPolicy(PolicyDTO dto) {
//        policyValidator.validateBeforeCreate(dto);
//        Policy saved = policyRepository.save(PolicyMapper.toEntity(dto));
//        return PolicyMapper.toDTO(saved);
//    }
//
//    @Override
//    public PolicyDTO updatePolicy(Long id, PolicyDTO dto) {
//        policyValidator.validateBeforeUpdate(id);
//        Policy existing = policyRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.policy.not.found", new Object[]{id}));
//
//        existing.setCondition(dto.getCondition());
//        existing.setDescription(dto.getDescription());
//        // update role/resource/action associations if DTO contains them
//        if (dto.getRole() != null) existing.setRole(com.dev.core.mapper.RoleMapper.toEntity(dto.getRole()));
//        if (dto.getResource() != null) existing.setResource(com.dev.core.mapper.ResourceMapper.toEntity(dto.getResource()));
//        if (dto.getAction() != null) existing.setAction(com.dev.core.mapper.ActionMapper.toEntity(dto.getAction()));
//
//        return PolicyMapper.toDTO(policyRepository.save(existing));
//    }
//
//    @Override
//    public void deletePolicy(Long id) {
//        policyValidator.validateBeforeUpdate(id);
//        policyRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public PolicyDTO getPolicyById(Long id) {
//        return policyRepository.findById(id).map(PolicyMapper::toDTO)
//                .orElseThrow(() -> new BaseException("error.policy.not.found", new Object[]{id}));
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<PolicyDTO> getPoliciesByOrganization(Long organizationId) {
//        return policyRepository.findAllByOrganizationId(organizationId).stream()
//                .map(PolicyMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<PolicyDTO> searchPolicies(Long organizationId, String keyword, Pageable pageable) {
//        Page<Policy> page = policyRepository.findAll(
//                SpecificationBuilder.of(Policy.class)
//                        .equals("organizationId", organizationId)
//                        .contains("description", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(PolicyMapper::toDTO);
//    }
//}


package com.dev.core.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Policy;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ActionMapper;
import com.dev.core.mapper.PolicyMapper;
import com.dev.core.mapper.ResourceMapper;
import com.dev.core.mapper.RoleMapper;
import com.dev.core.model.PolicyDTO;
import com.dev.core.repository.PolicyRepository;
import com.dev.core.service.AuthorizationService; // ✅ Correct import for RBAC
import com.dev.core.service.PolicyService;
import com.dev.core.service.validation.PolicyValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final PolicyValidator policyValidator;
    private final AuthorizationService authorizationService; // ✅ Injected for dynamic policy checks

    /**
     * Helper method for dynamic RBAC authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public PolicyDTO createPolicy(PolicyDTO dto) {
        authorize("CREATE"); // ✅ Ensure user can CREATE POLICY
        policyValidator.validateBeforeCreate(dto);

        Policy saved = policyRepository.save(PolicyMapper.toEntity(dto));
        return PolicyMapper.toDTO(saved);
    }

    @Override
    public PolicyDTO updatePolicy(Long id, PolicyDTO dto) {
        authorize("UPDATE"); // ✅ Ensure user can UPDATE POLICY
        policyValidator.validateBeforeUpdate(id);

        Policy existing = policyRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.policy.not.found", new Object[]{id}));

        existing.setCondition(dto.getCondition());
        existing.setDescription(dto.getDescription());

        // Update role/resource/action associations if provided
        if (dto.getRole() != null)
            existing.setRole(RoleMapper.toEntity(dto.getRole()));
        if (dto.getResource() != null)
            existing.setResource(ResourceMapper.toEntity(dto.getResource()));
        if (dto.getAction() != null)
            existing.setAction(ActionMapper.toEntity(dto.getAction()));

        Policy updated = policyRepository.save(existing);
        return PolicyMapper.toDTO(updated);
    }

    @Override
    public void deletePolicy(Long id) {
        authorize("DELETE"); // ✅ Ensure user can DELETE POLICY
        policyValidator.validateBeforeUpdate(id);
        policyRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PolicyDTO getPolicyById(Long id) {
        authorize("READ"); // ✅ Ensure user can READ POLICY
        return policyRepository.findById(id)
                .map(PolicyMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.policy.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicyDTO> getPoliciesByOrganization(Long organizationId) {
        authorize("READ"); // ✅ Ensure user can READ POLICY
        return policyRepository.findAllByOrganizationId(organizationId)
                .stream()
                .map(PolicyMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PolicyDTO> searchPolicies(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ"); // ✅ Ensure user can READ POLICY
        Page<Policy> page = policyRepository.findAll(
                SpecificationBuilder.of(Policy.class)
                        .equals("organizationId", organizationId)
                        .contains("description", keyword)
                        .build(),
                pageable
        );
        return page.map(PolicyMapper::toDTO);
    }
}
