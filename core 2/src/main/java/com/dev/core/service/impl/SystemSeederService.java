package com.dev.core.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.OrganizationStatus;
import com.dev.core.constants.UserStatus;
import com.dev.core.domain.*;
import com.dev.core.exception.BaseException;
import com.dev.core.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Seeds the database with the initial organization, admin, roles, actions,
 * resources, permissions, and policies.
 * 
 * This ensures the system has a functional SUPER_ADMIN with full privileges.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SystemSeederService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ActionRepository actionRepository;
    private final ResourceRepository resourceRepository;
    private final PermissionRepository permissionRepository;
    private final PolicyRepository policyRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String SYSTEM_ORG_CODE = "SYS-ORG";
    private static final String ADMIN_EMAIL = "admin@system.com";
    private static final String ADMIN_PASSWORD = "Admin@123"; // 🔒 Change in production

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        log.info("🚀 Starting system bootstrap seeding...");

        // 1️⃣ Create or fetch system organization
        Organization organization = organizationRepository.findByCode(SYSTEM_ORG_CODE)
                .orElseGet(() -> {
                    Organization org = new Organization();
                    org.setName("System Organization");
                    org.setCode(SYSTEM_ORG_CODE);
                    org.setDomain("system.local");
                    org.setStatus(OrganizationStatus.ACTIVE);
                    return organizationRepository.save(org);
                });

        log.info("✅ Organization: {}", organization.getName());

        // 2️⃣ Seed Actions (CRUD)
        List<String> baseActions = Arrays.asList("CREATE", "READ", "UPDATE", "DELETE");
        Map<String, ActionEntity> actions = baseActions.stream()
                .map(code -> actionRepository.findByCode(code)
                        .orElseGet(() -> {
                            ActionEntity a = new ActionEntity();
                            a.setName(code.substring(0, 1) + code.substring(1).toLowerCase());
                            a.setCode(code);
                            a.setOrganizationId(organization.getId());
                            return actionRepository.save(a);
                        }))
                .collect(Collectors.toMap(ActionEntity::getCode, a -> a));

        log.info("✅ Actions seeded: {}", actions.keySet());

        // 3️⃣ Seed Resources (from your domain)
        List<String> baseResources = Arrays.asList(
                "USER", "ROLE", "POLICY", "RESOURCE", "ACTION",
                "PERMISSION", "REFRESHTOKEN", "ORGANIZATION", "AUDITLOG","DEPARTMENT","DESIGNATION","EMPLOYEE","EMPLOYEES","CLIENT","TEAM","DOCUMENT","EMPLOYEE-DOCUMENT"
        );

        Map<String, ResourceEntity> resources = baseResources.stream()
                .map(code -> resourceRepository.findByCode(code)
                        .orElseGet(() -> {
                            ResourceEntity r = new ResourceEntity();
                            r.setName(code.substring(0, 1) + code.substring(1).toLowerCase());
                            r.setCode(code);
                            r.setDescription("System managed resource: " + code);
                            r.setOrganizationId(organization.getId());
                            return resourceRepository.save(r);
                        }))
                .collect(Collectors.toMap(ResourceEntity::getCode, r -> r));

        log.info("✅ Resources seeded: {}", resources.keySet());

        // 4️⃣ Seed Permissions (Resource × Action)
        List<Permission> allPermissions = new ArrayList<>();
        for (ResourceEntity resource : resources.values()) {
            for (ActionEntity action : actions.values()) {
                Optional<Permission> existing = permissionRepository.findByOrganizationIdAndResourceIdAndActionId(
                        organization.getId(), resource.getId(), action.getId());
                if (existing.isEmpty()) {
                    Permission permission = new Permission();
                    permission.setResource(resource);
                    permission.setAction(action);
                    permission.setDescription(resource.getCode() + " - " + action.getCode());
                    permission.setOrganizationId(organization.getId());
                    allPermissions.add(permissionRepository.save(permission));
                }
            }
        }

        log.info("✅ Permissions created: {}", allPermissions.size());

        // 5️⃣ Create SUPER_ADMIN role
        Role superAdminRole = roleRepository.findByNameAndOrganizationId("SUPER_ADMIN", organization.getId())
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName("SUPER_ADMIN");
                    r.setDescription("Full access to all resources");
                    r.setOrganizationId(organization.getId());
                    r.setPermissions(new HashSet<>(allPermissions)); // attach all permissions
                    return roleRepository.save(r);
                });

        log.info("✅ Role: SUPER_ADMIN ready");

        // 6️⃣ Create SUPER_ADMIN user
        User adminUser = userRepository.findByEmail(ADMIN_EMAIL)
                .orElseGet(() -> {
                    User u = new User();
                    u.setUsername("system-admin");
                    u.setEmail(ADMIN_EMAIL);
                    u.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                    u.setStatus(UserStatus.ACTIVE);
                    u.setOrganizationId(organization.getId());
                    u.setRoles(Set.of(superAdminRole));
                    return userRepository.save(u);
                });

        log.info("✅ Admin user: {} created", adminUser.getEmail());

        // 7️⃣ Create Policies for Role → Resource × Action
        List<Policy> allPolicies = new ArrayList<>();
        for (ResourceEntity resource : resources.values()) {
            for (ActionEntity action : actions.values()) {
                boolean exists = policyRepository.existsByRoleIdAndResourceIdAndActionId(
                        superAdminRole.getId(), resource.getId(), action.getId());
                if (!exists) {
                    Policy policy = new Policy();
                    policy.setRole(superAdminRole);
                    policy.setResource(resource);
                    policy.setAction(action);
                    policy.setOrganizationId(organization.getId());
                    policy.setDescription("SUPER_ADMIN full access policy");
                    allPolicies.add(policyRepository.save(policy));
                }
            }
        }

        log.info("✅ Policies created: {}", allPolicies.size());
        log.info("🎯 System seeding complete! SUPER_ADMIN ready to go.");
    }
}
