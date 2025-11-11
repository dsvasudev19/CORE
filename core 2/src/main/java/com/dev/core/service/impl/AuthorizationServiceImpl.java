
package com.dev.core.service.impl;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Policy;
import com.dev.core.domain.Role;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.repository.PolicyRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.AuthorizationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Evaluates access dynamically using Policy → (Role, Resource, Action)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorizationServiceImpl implements AuthorizationService {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final SecurityContextUtil securityContextUtil;

    /**
     * Verifies whether the current user (based on SecurityContext) is authorized
     * to perform the given action on the given resource.
     */
    @Override
    @Transactional(readOnly = true)
    public void authorize(String resourceCode, String actionCode) {
        log.info("🔐 [AUTHZ] Starting authorization check: resource='{}', action='{}'", resourceCode, actionCode);

        Long userId = securityContextUtil.getCurrentUserId();
        Long orgId = securityContextUtil.getCurrentOrganizationId();

        log.debug("👤 [AUTHZ] Context resolved → userId={}, orgId={}", userId, orgId);

        // Fetch user with roles
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("❌ [AUTHZ] User not found: id={}", userId);
                    return new BaseException("error.auth.user.notfound", new Object[]{userId});
                });

        log.debug("✅ [AUTHZ] User loaded: username={}, email={}, rolesInitialized={}", 
                user.getUsername(), user.getEmail(), user.getRoles() != null);

        Set<Role> roles = user.getRoles();
        if (roles == null || roles.isEmpty()) {
            log.warn("⚠️ [AUTHZ] User has no roles assigned → userId={}", userId);
            throw new BaseException("error.auth.no.roles");
            
        }

        Set<Long> roleIds = roles.stream()
                .map(Role::getId)
                .collect(Collectors.toSet());

        Set<String> roleNames = roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        log.debug("🧩 [AUTHZ] Extracted user roles → ids={}, names={}", roleIds, roleNames);

        // Fetch all policies for this organization
        var policies = policyRepository.findAllByOrganizationId(orgId);
        log.debug("📜 [AUTHZ] Loaded {} policies for orgId={}", policies.size(), orgId);

        // Filter applicable policies
        var matchingPolicies = policies.stream()
                .filter(p -> roleIds.contains(p.getRole().getId()))
                .peek(p -> log.trace("🔎 [AUTHZ] Checking policy: role={}, resource={}, action={}",
                        p.getRole().getName(),
                        p.getResource().getCode(),
                        p.getAction().getCode()))
                .filter(p -> 
                        p.getResource().getCode().equalsIgnoreCase(resourceCode) &&
                        p.getAction().getCode().equalsIgnoreCase(actionCode))
                .collect(Collectors.toList());

        boolean allowed = !matchingPolicies.isEmpty();

        if (allowed) {
            Policy matched = matchingPolicies.get(0);
            log.info("✅ [AUTHZ] Access GRANTED for user='{}' (role='{}') → resource='{}', action='{}'",
                    user.getUsername(),
                    matched.getRole().getName(),
                    resourceCode,
                    actionCode);
        } else {
            log.warn("🚫 [AUTHZ] Access DENIED → user='{}', roles={}, resource='{}', action='{}'",
                    user.getUsername(),
                    roleNames,
                    resourceCode,
                    actionCode);

            throw new BaseException("error.auth.access.denied", new Object[]{resourceCode, actionCode});
        }

        log.debug("🏁 [AUTHZ] Authorization check complete for userId={} → allowed={}", userId, allowed);
    }
}
