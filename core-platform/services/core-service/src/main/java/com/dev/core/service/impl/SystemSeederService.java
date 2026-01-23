//package com.dev.core.service.impl;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//import org.springframework.boot.context.event.ApplicationReadyEvent;
//import org.springframework.context.event.EventListener;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.constants.OrganizationStatus;
//import com.dev.core.constants.UserStatus;
//import com.dev.core.domain.*;
//import com.dev.core.exception.BaseException;
//import com.dev.core.repository.*;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//
///**
// * Seeds the database with the initial organization, admin, roles, actions,
// * resources, permissions, and policies.
// * 
// * This ensures the system has a functional SUPER_ADMIN with full privileges.
// */
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class SystemSeederService {
//
//    private final OrganizationRepository organizationRepository;
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//    private final ActionRepository actionRepository;
//    private final ResourceRepository resourceRepository;
//    private final PermissionRepository permissionRepository;
//    private final PolicyRepository policyRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    private static final String SYSTEM_ORG_CODE = "SYS-ORG";
//    private static final String ADMIN_EMAIL = "admin@system.com";
//    private static final String ADMIN_PASSWORD = "Admin@123"; // 🔒 Change in production
//
//    @EventListener(ApplicationReadyEvent.class)
//    @Transactional
//    public void seed() {
//        log.info("🚀 Starting system bootstrap seeding...");
//
//        // 1️⃣ Create or fetch system organization
//        Organization organization = organizationRepository.findByCode(SYSTEM_ORG_CODE)
//                .orElseGet(() -> {
//                    Organization org = new Organization();
//                    org.setName("System Organization");
//                    org.setCode(SYSTEM_ORG_CODE);
//                    org.setDomain("system.local");
//                    org.setStatus(OrganizationStatus.ACTIVE);
//                    return organizationRepository.save(org);
//                });
//
//        log.info("✅ Organization: {}", organization.getName());
//
//        // 2️⃣ Seed Actions (CRUD)
//        List<String> baseActions = Arrays.asList("CREATE", "READ", "UPDATE", "DELETE");
//        Map<String, ActionEntity> actions = baseActions.stream()
//                .map(code -> actionRepository.findByCode(code)
//                        .orElseGet(() -> {
//                            ActionEntity a = new ActionEntity();
//                            a.setName(code.substring(0, 1) + code.substring(1).toLowerCase());
//                            a.setCode(code);
//                            a.setOrganizationId(organization.getId());
//                            return actionRepository.save(a);
//                        }))
//                .collect(Collectors.toMap(ActionEntity::getCode, a -> a));
//
//        log.info("✅ Actions seeded: {}", actions.keySet());
//
//        // 3️⃣ Seed Resources (from your domain)
//        List<String> baseResources = Arrays.asList(
//                "USER", "ROLE", "POLICY", "RESOURCE", "ACTION",
//                "PERMISSION", "REFRESHTOKEN", "ORGANIZATION", "AUDITLOG","DEPARTMENT","DESIGNATION","EMPLOYEE","EMPLOYEES","CLIENT","TEAM","DOCUMENT","EMPLOYEE-DOCUMENT"
//        );
//
//        Map<String, ResourceEntity> resources = baseResources.stream()
//                .map(code -> resourceRepository.findByCode(code)
//                        .orElseGet(() -> {
//                            ResourceEntity r = new ResourceEntity();
//                            r.setName(code.substring(0, 1) + code.substring(1).toLowerCase());
//                            r.setCode(code);
//                            r.setDescription("System managed resource: " + code);
//                            r.setOrganizationId(organization.getId());
//                            return resourceRepository.save(r);
//                        }))
//                .collect(Collectors.toMap(ResourceEntity::getCode, r -> r));
//
//        log.info("✅ Resources seeded: {}", resources.keySet());
//
//        // 4️⃣ Seed Permissions (Resource × Action)
//        List<Permission> allPermissions = new ArrayList<>();
//        for (ResourceEntity resource : resources.values()) {
//            for (ActionEntity action : actions.values()) {
//                Optional<Permission> existing = permissionRepository.findByOrganizationIdAndResourceIdAndActionId(
//                        organization.getId(), resource.getId(), action.getId());
//                if (existing.isEmpty()) {
//                    Permission permission = new Permission();
//                    permission.setResource(resource);
//                    permission.setAction(action);
//                    permission.setDescription(resource.getCode() + " - " + action.getCode());
//                    permission.setOrganizationId(organization.getId());
//                    allPermissions.add(permissionRepository.save(permission));
//                }
//            }
//        }
//
//        log.info("✅ Permissions created: {}", allPermissions.size());
//
//        // 5️⃣ Create SUPER_ADMIN role
//        Role superAdminRole = roleRepository.findByNameAndOrganizationId("SUPER_ADMIN", organization.getId())
//                .orElseGet(() -> {
//                    Role r = new Role();
//                    r.setName("SUPER_ADMIN");
//                    r.setDescription("Full access to all resources");
//                    r.setOrganizationId(organization.getId());
//                    r.setPermissions(new HashSet<>(allPermissions)); // attach all permissions
//                    return roleRepository.save(r);
//                });
//
//        log.info("✅ Role: SUPER_ADMIN ready");
//
//        // 6️⃣ Create SUPER_ADMIN user
//        User adminUser = userRepository.findByEmail(ADMIN_EMAIL)
//                .orElseGet(() -> {
//                    User u = new User();
//                    u.setUsername("system-admin");
//                    u.setEmail(ADMIN_EMAIL);
//                    u.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
//                    u.setStatus(UserStatus.ACTIVE);
//                    u.setOrganizationId(organization.getId());
//                    u.setRoles(Set.of(superAdminRole));
//                    return userRepository.save(u);
//                });
//
//        log.info("✅ Admin user: {} created", adminUser.getEmail());
//
//        // 7️⃣ Create Policies for Role → Resource × Action
//        List<Policy> allPolicies = new ArrayList<>();
//        for (ResourceEntity resource : resources.values()) {
//            for (ActionEntity action : actions.values()) {
//                boolean exists = policyRepository.existsByRoleIdAndResourceIdAndActionId(
//                        superAdminRole.getId(), resource.getId(), action.getId());
//                if (!exists) {
//                    Policy policy = new Policy();
//                    policy.setRole(superAdminRole);
//                    policy.setResource(resource);
//                    policy.setAction(action);
//                    policy.setOrganizationId(organization.getId());
//                    policy.setDescription("SUPER_ADMIN full access policy");
//                    allPolicies.add(policyRepository.save(policy));
//                }
//            }
//        }
//
//        log.info("✅ Policies created: {}", allPolicies.size());
//        log.info("🎯 System seeding complete! SUPER_ADMIN ready to go.");
//    }
//}
package com.dev.core.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.OrganizationStatus;
import com.dev.core.constants.UserStatus;
import com.dev.core.domain.*;
import com.dev.core.repository.*;

import java.util.*;
import java.util.stream.Collectors;

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

    @Lazy
    private final PasswordEncoder passwordEncoder;

    // Change these in application.yml or env vars in real prod!
    private static final String SYSTEM_ORG_CODE = "SYS-ORG";
    private static final String DEFAULT_ADMIN_EMAIL = "admin@system.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123"; // CHANGE IMMEDIATELY AFTER FIRST LOGIN

    private static final List<String> RESOURCES = Arrays.asList(
            "USER", "ROLE", "POLICY", "RESOURCE", "ACTION", "PERMISSION",
            "ORGANIZATION", "DEPARTMENT", "DESIGNATION", "EMPLOYEE", "CLIENT",
            "TEAM", "PROJECT", "TASK", "BUG", "DOCUMENT", "PROJECTFILE",
            "PROJECTDOCUMENT", "AUDITLOG", "REFRESHTOKEN", "TIMESHEET", "REPORT","TASKDEPENDENCY",
            "CLIENT_DOCUMENT","PROJECTPHASE","PROJECT_MEMBER","TASKCOMMENT","TASKTAGS","TASK_TAGS","TASKATTACHMENT","BUG_HISTORY","BUG_COMMENT","BUG_ATTACHMENT","TODO","TIMELOG",
            "PAYROLL", "PAYROLL_HISTORY", "ATTENDANCE", "PERFORMANCE", "ANNOUNCEMENT"
    );

    private static final List<String> ACTIONS = Arrays.asList("CREATE", "READ", "UPDATE", "DELETE");

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        log.info("Starting system seeding with correct RBAC structure...");

        Organization org = ensureSystemOrganization();
        Map<String, ActionEntity> actions = seedActions(org);
        Map<String, ResourceEntity> resources = seedResources(org);
        List<Permission> allPermissions = seedAllPermissions(org, resources, actions);

        Map<String, Set<String>> roleMatrix = defineRolePermissionMatrix();

        // Seed all roles with correct permissions attached + policies created
        createRoleWithPolicies("SUPER_ADMIN", "God mode – full system access", allPermissions, org, roleMatrix);
        createRoleWithPolicies("ORG_ADMIN", "Full control within organization", allPermissions, org, roleMatrix);
        createRoleWithPolicies("PROJECT_MANAGER", "Manages projects, tasks, teams, clients", allPermissions, org, roleMatrix);
        createRoleWithPolicies("TEAM_LEAD", "Leads team, assigns tasks, reviews work", allPermissions, org, roleMatrix);
        createRoleWithPolicies("DEVELOPER", "Develops features, fixes bugs, logs time", allPermissions, org, roleMatrix);
        createRoleWithPolicies("CLIENT", "External stakeholder – view only", allPermissions, org, roleMatrix);
        createRoleWithPolicies("GUEST", "Minimal read access", allPermissions, org, roleMatrix);

        createDefaultAdminUser(org);

        log.info("System seeding completed successfully! All roles have permissions + policies.");
    }

    private Organization ensureSystemOrganization() {
        return organizationRepository.findByCode(SYSTEM_ORG_CODE)
                .orElseGet(() -> {
                    Organization org = new Organization();
                    org.setName("System Organization");
                    org.setCode(SYSTEM_ORG_CODE);
                    org.setDomain("system.local");
                    org.setStatus(OrganizationStatus.ACTIVE);
                    return organizationRepository.save(org);
                });
    }

    private Map<String, ActionEntity> seedActions(Organization org) {
        return ACTIONS.stream()
                .map(code -> actionRepository.findByCode(code)
                        .orElseGet(() -> {
                            ActionEntity a = new ActionEntity();
                            a.setCode(code);
                            a.setName(code.substring(0,1) + code.substring(1).toLowerCase());
                            a.setOrganizationId(org.getId());
                            return actionRepository.save(a);
                        }))
                .collect(Collectors.toMap(ActionEntity::getCode, a -> a));
    }

    private Map<String, ResourceEntity> seedResources(Organization org) {
        return RESOURCES.stream()
                .map(code -> resourceRepository.findByCode(code)
                        .orElseGet(() -> {
                            ResourceEntity r = new ResourceEntity();
                            r.setCode(code);
                            r.setName(code.substring(0,1) + code.substring(1).toLowerCase());
                            r.setDescription("Resource: " + code);
                            r.setOrganizationId(org.getId());
                            return resourceRepository.save(r);
                        }))
                .collect(Collectors.toMap(ResourceEntity::getCode, r -> r));
    }

    private List<Permission> seedAllPermissions(Organization org,
                                                 Map<String, ResourceEntity> resources,
                                                 Map<String, ActionEntity> actions) {
        List<Permission> permissions = new ArrayList<>();

        for (ResourceEntity res : resources.values()) {
            for (ActionEntity act : actions.values()) {
                permissionRepository.findByOrganizationIdAndResourceIdAndActionId(
                        org.getId(), res.getId(), act.getId()
                ).orElseGet(() -> {
                    Permission p = new Permission();
                    p.setResource(res);
                    p.setAction(act);
                    p.setOrganizationId(org.getId());
                    p.setDescription(res.getCode() + ":" + act.getCode());
                    permissions.add(permissionRepository.save(p));
                    return p;
                });
            }
        }
        log.info("{} base permissions created/verified", permissions.size());
        return permissions;
    }

    private Map<String, Set<String>> defineRolePermissionMatrix() {
        Map<String, Set<String>> matrix = new HashMap<>();

        Set<String> all = RESOURCES.stream()
                .flatMap(res -> ACTIONS.stream().map(act -> res + ":" + act))
                .collect(Collectors.toSet());

        matrix.put("SUPER_ADMIN", all);

        Set<String> orgAdmin = new HashSet<>(all);
        orgAdmin.removeIf(p -> p.startsWith("ACTION:") || p.startsWith("RESOURCE:") || p.startsWith("PERMISSION:")
                || p.startsWith("POLICY:") || p.startsWith("ORGANIZATION:"));
        matrix.put("ORG_ADMIN", orgAdmin);

        matrix.put("PROJECT_MANAGER", Set.of(
                "PROJECT:CREATE", "PROJECT:READ", "PROJECT:UPDATE", "PROJECT:DELETE",
                "TASK:CREATE", "TASK:READ", "TASK:UPDATE", "TASK:DELETE",
                "BUG:CREATE", "BUG:READ", "BUG:UPDATE", "BUG:DELETE",
                "CLIENT:READ", "CLIENT:UPDATE",
                "TEAM:READ", "TEAM:UPDATE",
                "DOCUMENT:CREATE", "DOCUMENT:READ", "DOCUMENT:UPDATE", "DOCUMENT:DELETE",
                "REPORT:READ",
                "PAYROLL:READ", "PAYROLL_HISTORY:READ"
        ));

        matrix.put("TEAM_LEAD", Set.of(
                "TASK:READ", "TASK:UPDATE", "TASK:CREATE",
                "BUG:READ", "BUG:UPDATE", "BUG:CREATE",
                "DOCUMENT:READ", "DOCUMENT:CREATE",
                "EMPLOYEE:READ", "TIMESHEET:READ"
        ));

        matrix.put("DEVELOPER", Set.of(
                "TASK:READ", "TASK:UPDATE",
                "BUG:READ", "BUG:UPDATE", "BUG:CREATE",
                "DOCUMENT:READ", "DOCUMENT:CREATE",
                "TIMESHEET:CREATE", "TIMESHEET:READ", "TIMESHEET:UPDATE"
        ));

        matrix.put("CLIENT", Set.of(
                "PROJECT:READ", "TASK:READ", "BUG:READ", "DOCUMENT:READ"
        ));

        matrix.put("GUEST", Set.of("PROJECT:READ", "TASK:READ"));

        return matrix;
    }

    /**
     * This is the CORRECT way:
     - Attaches permissions to Role (so UI shows them)
     - Creates Policy records (for runtime hasPermission checks)
     */
    private void createRoleWithPolicies(String roleName,
                                        String description,
                                        Collection<Permission> allPermissions,
                                        Organization org,
                                        Map<String, Set<String>> matrix) {

        Set<String> allowedCodes = matrix.getOrDefault(roleName, Set.of());

        // Filter permissions this role should actually have
        Set<Permission> rolePermissions = allPermissions.stream()
                .filter(p -> allowedCodes.contains(p.getResource().getCode() + ":" + p.getAction().getCode()))
                .collect(Collectors.toSet());

        // Create or update Role + attach permissions (this populates the join table!)
        Role role = roleRepository.findByNameAndOrganizationId(roleName, org.getId())
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName(roleName);
                    r.setDescription(description);
                    r.setOrganizationId(org.getId());
                    r.setPermissions(new HashSet<>());
                    return roleRepository.save(r);
                });

        if (!Objects.equals(role.getPermissions(), rolePermissions)) {
            role.setPermissions(rolePermissions);
            roleRepository.save(role);
        }

        // Create Policy entries for runtime evaluation
        int policyCount = 0;
        for (Permission perm : rolePermissions) {
            boolean exists = policyRepository.existsByRoleIdAndResourceIdAndActionId(
                    role.getId(), perm.getResource().getId(), perm.getAction().getId());

            if (!exists) {
                Policy policy = new Policy();
                policy.setRole(role);
                policy.setResource(perm.getResource());
                policy.setAction(perm.getAction());
                policy.setOrganizationId(org.getId());
                policy.setDescription(roleName + " → " + perm.getResource().getCode() + ":" + perm.getAction().getCode());
                policyRepository.save(policy);
                policyCount++;
            }
        }

        log.info("Role '{}' → {} permissions attached | {} new policies created",
                roleName, rolePermissions.size(), policyCount);
    }

    private void createDefaultAdminUser(Organization org) {
        if (userRepository.findByEmail(DEFAULT_ADMIN_EMAIL).isPresent()) {
            log.info("Default admin user already exists – skipping creation.");
            return;
        }

        // 1. Get ORG_ADMIN role (with all its permissions already attached)
        Role superAdminRoleId = roleRepository.findByNameAndOrganizationId("SUPER_ADMIN", org.getId())
                .orElseThrow(() -> new IllegalStateException("SUPER_ADMIN role not found – seeding failed"));

        // 2. Get EVERY SINGLE PERMISSION that exists in the system
        Set<Permission> allExistingPermissions = new HashSet<>(permissionRepository.findAllByOrganizationId(org.getId()));

        // 3. Create the admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail(DEFAULT_ADMIN_EMAIL);
        admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
       
        admin.setStatus(UserStatus.ACTIVE);
        admin.setOrganizationId(org.getId());

        // 4. Assign:
        //     • the ORG_ADMIN role  (so he gets everything ORG_ADMIN normally has)
        //     • AND every single permission directly (so he becomes true "God" inside the org)
        admin.setRoles(Set.of(superAdminRoleId));
        admin.setPermissions(allExistingPermissions);   // ← THIS IS THE KEY LINE

        userRepository.save(admin);

        log.warn("ORG_ADMIN user created with FULLY EMPOWERED:");
        log.warn("   Email    : {}", DEFAULT_ADMIN_EMAIL);
        log.warn("   Password : {}", DEFAULT_ADMIN_PASSWORD);
        log.warn("   Roles    : ORG_ADMIN");
        log.warn("   Direct Permissions : {} (literally everything)", allExistingPermissions.size());
        log.warn("CHANGE THE DEFAULT PASSWORD IMMEDIATELY!");
    }
}