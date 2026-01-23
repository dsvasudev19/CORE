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

import java.time.LocalDate;
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
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    @Lazy
    private final PasswordEncoder passwordEncoder;

    // Change these in application.yml or env vars in real prod!
    private static final String SYSTEM_ORG_CODE = "SYS-ORG";
    private static final String DEFAULT_ADMIN_EMAIL = "admin@system.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123"; // CHANGE IMMEDIATELY AFTER FIRST LOGIN
    
    private static final String SAMPLE_EMPLOYEE_EMAIL = "rajesh.kumar@system.com";
    private static final String SAMPLE_EMPLOYEE_PASSWORD = "Employee@123";

    private static final List<String> RESOURCES = Arrays.asList(
            "USER", "ROLE", "POLICY", "RESOURCE", "ACTION", "PERMISSION",
            "ORGANIZATION", "DEPARTMENT", "DESIGNATION", "EMPLOYEE", "CLIENT",
            "TEAM", "PROJECT", "TASK", "BUG", "DOCUMENT", "PROJECTFILE",
            "PROJECTDOCUMENT", "AUDITLOG", "REFRESHTOKEN", "TIMESHEET", "REPORT","TASKDEPENDENCY",
            "CLIENT_DOCUMENT","PROJECTPHASE","PROJECT_MEMBER","TASKCOMMENT","TASKTAGS","TASK_TAGS","TASKATTACHMENT",
            "BUG_HISTORY","BUG_COMMENT","BUG_ATTACHMENT","TODO","TIMELOG",
            "PAYROLL", "PAYROLL_HISTORY", "ATTENDANCE", "PERFORMANCE", "ANNOUNCEMENT", "MESSAGING",
            "CALENDAR", "CALENDAR_EVENT"
    );

    private static final List<String> ACTIONS = Arrays.asList("CREATE", "READ", "UPDATE", "DELETE");

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        log.info("========================================");
        log.info("🚀 Starting system seeding with RBAC...");
        log.info("========================================");

        Organization org = ensureSystemOrganization();
        log.info("✅ Organization: {} (ID: {})", org.getName(), org.getId());
        
        Map<String, ActionEntity> actions = seedActions(org);
        log.info("✅ Actions seeded: {}", actions.keySet());
        
        Map<String, ResourceEntity> resources = seedResources(org);
        log.info("✅ Resources seeded: {} resources", resources.size());
        
        List<Permission> allPermissions = seedAllPermissions(org, resources, actions);
        log.info("✅ Total permissions created: {}", allPermissions.size());

        Map<String, Set<String>> roleMatrix = defineRolePermissionMatrix();
        log.info("✅ Role permission matrix defined for {} roles", roleMatrix.size());

        log.info("========================================");
        log.info("Creating roles with permissions...");
        log.info("========================================");
        
        // Seed all roles with correct permissions attached + policies created
        createRoleWithPolicies("SUPER_ADMIN", "God mode – full system access", allPermissions, org, roleMatrix);
        createRoleWithPolicies("ORG_ADMIN", "Full control within organization", allPermissions, org, roleMatrix);
        createRoleWithPolicies("PROJECT_MANAGER", "Manages projects, tasks, teams, clients", allPermissions, org, roleMatrix);
        createRoleWithPolicies("TEAM_LEAD", "Leads team, assigns tasks, reviews work", allPermissions, org, roleMatrix);
        createRoleWithPolicies("DEVELOPER", "Develops features, fixes bugs, logs time", allPermissions, org, roleMatrix);
        createRoleWithPolicies("CLIENT", "External stakeholder – view only", allPermissions, org, roleMatrix);
        createRoleWithPolicies("GUEST", "Minimal read access", allPermissions, org, roleMatrix);

        log.info("========================================");
        log.info("Seeding departments and designations...");
        log.info("========================================");
        
        // Seed comprehensive departments and designations
        seedDepartments(org);
        seedDesignations(org);

        log.info("========================================");
        log.info("Creating sample users and employees...");
        log.info("========================================");
        
        // Create sample department and designation for employees
        Department department = createSampleDepartment(org);
        Designation designation = createSampleDesignation(org);

        createDefaultAdminUser(org, department, designation);
        createSampleEmployee(org, department, designation);
        
        // Create additional sample employees with different roles
        createSampleEmployees(org);

        log.info("========================================");
        log.info("✅ System seeding completed successfully!");
        log.info("========================================");
        log.info("📊 Summary:");
        log.info("   - {} Actions", actions.size());
        log.info("   - {} Resources", resources.size());
        log.info("   - {} Permissions", allPermissions.size());
        log.info("   - {} Roles with permissions", roleMatrix.size());
        log.info("   - Departments and designations seeded");
        log.info("   - Sample employees created with auto role assignment");
        log.info("========================================");
        
        // Verify roles have permissions
        verifyRolePermissions(org);
    }
    
    /**
     * Verifies that all roles have their permissions properly assigned
     */
    private void verifyRolePermissions(Organization org) {
        log.info("========================================");
        log.info("🔍 Verifying role permissions...");
        log.info("========================================");
        
        List<String> roleNames = Arrays.asList("SUPER_ADMIN", "ORG_ADMIN", "PROJECT_MANAGER", 
                                               "TEAM_LEAD", "DEVELOPER", "CLIENT", "GUEST");
        
        for (String roleName : roleNames) {
            roleRepository.findByNameAndOrganizationId(roleName, org.getId())
                    .ifPresent(role -> {
                        int permCount = role.getPermissions() != null ? role.getPermissions().size() : 0;
                        long policyCount = policyRepository.countByRoleId(role.getId());
                        
                        if (permCount > 0) {
                            log.info("✅ {} → {} permissions, {} policies", 
                                    roleName, permCount, policyCount);
                        } else {
                            log.warn("⚠️  {} → NO PERMISSIONS ASSIGNED!", roleName);
                        }
                    });
        }
        
        log.info("========================================");
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
        int created = 0;
        int existing = 0;

        for (ResourceEntity res : resources.values()) {
            for (ActionEntity act : actions.values()) {
                Optional<Permission> existingPerm = permissionRepository.findByOrganizationIdAndResourceIdAndActionId(
                        org.getId(), res.getId(), act.getId()
                );
                
                if (existingPerm.isPresent()) {
                    permissions.add(existingPerm.get());
                    existing++;
                } else {
                    Permission p = new Permission();
                    p.setResource(res);
                    p.setAction(act);
                    p.setOrganizationId(org.getId());
                    p.setDescription(res.getCode() + ":" + act.getCode());
                    Permission saved = permissionRepository.save(p);
                    permissions.add(saved);
                    created++;
                }
            }
        }
        
        log.info("Permissions: {} existing, {} newly created, {} total", existing, created, permissions.size());
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
                "PAYROLL:READ", "PAYROLL_HISTORY:READ",
                "TIMESHEET:READ", "TIMELOG:READ",
                "TODO:READ", "TODO:CREATE", "TODO:UPDATE", "TODO:DELETE",
                "CALENDAR:READ", "CALENDAR:CREATE", "CALENDAR:UPDATE", "CALENDAR:DELETE",
                "CALENDAR_EVENT:CREATE", "CALENDAR_EVENT:READ", "CALENDAR_EVENT:UPDATE", "CALENDAR_EVENT:DELETE",
                "USER:READ",
                "MESSAGING:CREATE", "MESSAGING:READ", "MESSAGING:UPDATE", "MESSAGING:DELETE"
        ));

        matrix.put("TEAM_LEAD", Set.of(
                "PROJECT:READ",
                "TASK:READ", "TASK:UPDATE", "TASK:CREATE",
                "BUG:READ", "BUG:UPDATE", "BUG:CREATE",
                "DOCUMENT:READ", "DOCUMENT:CREATE",
                "EMPLOYEE:READ", 
                "TIMESHEET:READ", "TIMELOG:READ",
                "TODO:READ", "TODO:CREATE", "TODO:UPDATE",
                "CALENDAR:READ", "CALENDAR:CREATE", "CALENDAR:UPDATE",
                "CALENDAR_EVENT:CREATE", "CALENDAR_EVENT:READ", "CALENDAR_EVENT:UPDATE", "CALENDAR_EVENT:DELETE",
                "USER:READ",
                "MESSAGING:CREATE", "MESSAGING:READ", "MESSAGING:UPDATE"
        ));

        matrix.put("DEVELOPER", Set.of(
                "PROJECT:READ",
                "TASK:READ", "TASK:UPDATE",
                "BUG:READ", "BUG:UPDATE", "BUG:CREATE",
                "DOCUMENT:READ", "DOCUMENT:CREATE",
                "TIMESHEET:CREATE", "TIMESHEET:READ", "TIMESHEET:UPDATE",
                "TIMELOG:CREATE", "TIMELOG:READ", "TIMELOG:UPDATE",
                "TODO:CREATE", "TODO:READ", "TODO:UPDATE", "TODO:DELETE",
                "CALENDAR:READ", "CALENDAR:CREATE", "CALENDAR:UPDATE",
                "CALENDAR_EVENT:CREATE", "CALENDAR_EVENT:READ", "CALENDAR_EVENT:UPDATE", "CALENDAR_EVENT:DELETE",
                "USER:READ",
                "MESSAGING:CREATE", "MESSAGING:READ", "MESSAGING:UPDATE"
        ));

        matrix.put("CLIENT", Set.of(
                "PROJECT:READ", "TASK:READ", "BUG:READ", "DOCUMENT:READ",
                "MESSAGING:READ"
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
        
        log.info("Creating/updating role '{}' with {} allowed permission codes", roleName, allowedCodes.size());

        // Filter permissions this role should actually have
        Set<Permission> rolePermissions = allPermissions.stream()
                .filter(p -> {
                    String permCode = p.getResource().getCode() + ":" + p.getAction().getCode();
                    return allowedCodes.contains(permCode);
                })
                .collect(Collectors.toSet());
        
        log.info("Filtered {} permissions for role '{}'", rolePermissions.size(), roleName);

        // Create or update Role + attach permissions (this populates the join table!)
        Role role = roleRepository.findByNameAndOrganizationId(roleName, org.getId())
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName(roleName);
                    r.setDescription(description);
                    r.setOrganizationId(org.getId());
                    r.setPermissions(new HashSet<>());
                    log.info("Creating new role: {}", roleName);
                    return r;
                });

        // ALWAYS update permissions to ensure they're attached
        role.setDescription(description); // Update description in case it changed
        role.setPermissions(new HashSet<>(rolePermissions)); // Clear and set fresh permissions
        role = roleRepository.save(role);
        
        log.info("Role '{}' saved with {} permissions attached", roleName, role.getPermissions().size());

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

        log.info("✅ Role '{}' → {} permissions attached | {} new policies created",
                roleName, rolePermissions.size(), policyCount);
    }

    private void createDefaultAdminUser(Organization org, Department department, Designation designation) {
        if (userRepository.findByEmail(DEFAULT_ADMIN_EMAIL).isPresent()) {
            log.info("Default admin user already exists – skipping creation.");
            return;
        }

        // 1. Get SUPER_ADMIN role (with all its permissions already attached)
        Role superAdminRole = roleRepository.findByNameAndOrganizationId("SUPER_ADMIN", org.getId())
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
        admin.setRoles(Set.of(superAdminRole));
        admin.setPermissions(allExistingPermissions);
        
        User savedAdmin = userRepository.save(admin);

        // 4. Create Employee record for admin
        Employee adminEmployee = Employee.builder()
                .employeeCode("EMP-ADMIN-001")
                .firstName("System")
                .lastName("Administrator")
                .email(DEFAULT_ADMIN_EMAIL)
                .phone("+1-555-0100")
                .joiningDate(LocalDate.now())
                .status(com.dev.core.constants.EmployeeStatus.ACTIVE)
                .profileStatus(com.dev.core.constants.ProfileStatus.OPENED)
                .department(department)
                .designation(designation)
                .user(savedAdmin)
                .policyAcknowledgment(true)
                .ndaSigned(true)
                .securityTraining(true)
                .build();
        
        employeeRepository.save(adminEmployee);

        log.warn("SUPER_ADMIN user created with FULLY EMPOWERED:");
        log.warn("   Email    : {}", DEFAULT_ADMIN_EMAIL);
        log.warn("   Password : {}", DEFAULT_ADMIN_PASSWORD);
        log.warn("   Roles    : SUPER_ADMIN");
        log.warn("   Direct Permissions : {} (literally everything)", allExistingPermissions.size());
        log.warn("   Employee Code: EMP-ADMIN-001");
        log.warn("CHANGE THE DEFAULT PASSWORD IMMEDIATELY!");
    }

    private void createSampleEmployee(Organization org, Department department, Designation designation) {
        if (userRepository.findByEmail(SAMPLE_EMPLOYEE_EMAIL).isPresent()) {
            log.info("Sample employee user already exists – skipping creation.");
            return;
        }

        // 1. Get DEVELOPER role
        Role developerRole = roleRepository.findByNameAndOrganizationId("DEVELOPER", org.getId())
                .orElseThrow(() -> new IllegalStateException("DEVELOPER role not found – seeding failed"));

        // 2. Create the employee user
        User employeeUser = new User();
        employeeUser.setUsername("rajesh.kumar");
        employeeUser.setEmail(SAMPLE_EMPLOYEE_EMAIL);
        employeeUser.setPassword(passwordEncoder.encode(SAMPLE_EMPLOYEE_PASSWORD));
        employeeUser.setStatus(UserStatus.ACTIVE);
        employeeUser.setOrganizationId(org.getId());
        employeeUser.setRoles(Set.of(developerRole));
        
        User savedEmployee = userRepository.save(employeeUser);

        // 3. Create Employee record
        Employee employee = Employee.builder()
                .employeeCode("EMP-DEV-001")
                .firstName("Rajesh")
                .lastName("Kumar")
                .email(SAMPLE_EMPLOYEE_EMAIL)
                .phone("+91-98765-43210")
                .joiningDate(LocalDate.now().minusMonths(6))
                .status(com.dev.core.constants.EmployeeStatus.ACTIVE)
                .profileStatus(com.dev.core.constants.ProfileStatus.OPENED)
                .department(department)
                .designation(designation)
                .user(savedEmployee)
                .policyAcknowledgment(true)
                .ndaSigned(true)
                .securityTraining(true)
                .build();
        
        employeeRepository.save(employee);

        log.info("Sample employee created:");
        log.info("   Email    : {}", SAMPLE_EMPLOYEE_EMAIL);
        log.info("   Password : {}", SAMPLE_EMPLOYEE_PASSWORD);
        log.info("   Role     : DEVELOPER");
        log.info("   Employee Code: EMP-DEV-001");
    }

    private Department createSampleDepartment(Organization org) {
        // Check if department already exists
        if (departmentRepository.existsByNameAndOrganizationId("Engineering", org.getId())) {
            List<Department> departments = departmentRepository.findByOrganizationId(org.getId());
            return departments.stream()
                    .filter(d -> "Engineering".equals(d.getName()))
                    .findFirst()
                    .orElseThrow();
        }
        
        // Create new department
        Department dept = new Department();
        dept.setName("Engineering");
        dept.setCode("ENG");
        dept.setDescription("Engineering Department");
        dept.setOrganizationId(org.getId());
        dept.setActive(true);
        return departmentRepository.save(dept);
    }

    private Designation createSampleDesignation(Organization org) {
        // Check if designation already exists
        if (designationRepository.existsByTitleAndOrganizationId("Software Engineer", org.getId())) {
            List<Designation> designations = designationRepository.findByOrganizationId(org.getId());
            return designations.stream()
                    .filter(d -> "Software Engineer".equals(d.getTitle()))
                    .findFirst()
                    .orElseThrow();
        }
        
        // Create new designation
        Designation desig = new Designation();
        desig.setTitle("Software Engineer");
        desig.setCode("SE");
        desig.setDescription("Software Engineer");
        desig.setOrganizationId(org.getId());
        desig.setActive(true);
        return designationRepository.save(desig);
    }
    
    /**
     * Seeds comprehensive departments for a mid-size IT company
     */
    private void seedDepartments(Organization org) {
        List<DepartmentData> departments = Arrays.asList(
            new DepartmentData("Engineering", "ENG", "Software Development and Engineering"),
            new DepartmentData("Quality Assurance", "QA", "Quality Assurance and Testing"),
            new DepartmentData("Product Management", "PM", "Product Strategy and Management"),
            new DepartmentData("Design", "DES", "UI/UX and Graphic Design"),
            new DepartmentData("DevOps", "DEVOPS", "DevOps and Infrastructure"),
            new DepartmentData("Data Science", "DS", "Data Science and Analytics"),
            new DepartmentData("Human Resources", "HR", "Human Resources and People Operations"),
            new DepartmentData("Finance", "FIN", "Finance and Accounting"),
            new DepartmentData("Sales", "SALES", "Sales and Business Development"),
            new DepartmentData("Marketing", "MKT", "Marketing and Communications"),
            new DepartmentData("Customer Success", "CS", "Customer Success and Support"),
            new DepartmentData("IT Support", "IT", "IT Support and Administration"),
            new DepartmentData("Legal", "LEGAL", "Legal and Compliance"),
            new DepartmentData("Operations", "OPS", "Operations and Administration")
        );
        
        for (DepartmentData data : departments) {
            if (!departmentRepository.existsByNameAndOrganizationId(data.name, org.getId())) {
                Department dept = new Department();
                dept.setName(data.name);
                dept.setCode(data.code);
                dept.setDescription(data.description);
                dept.setOrganizationId(org.getId());
                dept.setActive(true);
                departmentRepository.save(dept);
                log.info("Created department: {}", data.name);
            }
        }
    }
    
    /**
     * Seeds comprehensive designations for a mid-size IT company with role mappings
     */
    private void seedDesignations(Organization org) {
        List<DesignationData> designations = Arrays.asList(
            // Engineering
            new DesignationData("Junior Software Engineer", "JSE", "Entry-level software engineer", "DEVELOPER"),
            new DesignationData("Software Engineer", "SE", "Mid-level software engineer", "DEVELOPER"),
            new DesignationData("Senior Software Engineer", "SSE", "Senior software engineer", "DEVELOPER"),
            new DesignationData("Lead Software Engineer", "LSE", "Technical lead", "TEAM_LEAD"),
            new DesignationData("Engineering Manager", "EM", "Engineering team manager", "PROJECT_MANAGER"),
            new DesignationData("Principal Engineer", "PE", "Principal/Staff engineer", "TEAM_LEAD"),
            new DesignationData("VP of Engineering", "VPE", "Vice President of Engineering", "ORG_ADMIN"),
            new DesignationData("CTO", "CTO", "Chief Technology Officer", "ORG_ADMIN"),
            
            // Quality Assurance
            new DesignationData("QA Engineer", "QAE", "Quality Assurance Engineer", "DEVELOPER"),
            new DesignationData("Senior QA Engineer", "SQAE", "Senior QA Engineer", "DEVELOPER"),
            new DesignationData("QA Lead", "QAL", "QA Team Lead", "TEAM_LEAD"),
            new DesignationData("QA Manager", "QAM", "QA Manager", "PROJECT_MANAGER"),
            
            // Product Management
            new DesignationData("Associate Product Manager", "APM", "Associate Product Manager", "DEVELOPER"),
            new DesignationData("Product Manager", "PM", "Product Manager", "PROJECT_MANAGER"),
            new DesignationData("Senior Product Manager", "SPM", "Senior Product Manager", "PROJECT_MANAGER"),
            new DesignationData("VP of Product", "VPP", "Vice President of Product", "ORG_ADMIN"),
            
            // Design
            new DesignationData("UI/UX Designer", "UIUX", "UI/UX Designer", "DEVELOPER"),
            new DesignationData("Senior Designer", "SD", "Senior Designer", "DEVELOPER"),
            new DesignationData("Design Lead", "DL", "Design Team Lead", "TEAM_LEAD"),
            new DesignationData("Head of Design", "HOD", "Head of Design", "PROJECT_MANAGER"),
            
            // DevOps
            new DesignationData("DevOps Engineer", "DOE", "DevOps Engineer", "DEVELOPER"),
            new DesignationData("Senior DevOps Engineer", "SDOE", "Senior DevOps Engineer", "DEVELOPER"),
            new DesignationData("DevOps Lead", "DOL", "DevOps Team Lead", "TEAM_LEAD"),
            new DesignationData("Infrastructure Manager", "IM", "Infrastructure Manager", "PROJECT_MANAGER"),
            
            // Data Science
            new DesignationData("Data Analyst", "DA", "Data Analyst", "DEVELOPER"),
            new DesignationData("Data Scientist", "DSC", "Data Scientist", "DEVELOPER"),
            new DesignationData("Senior Data Scientist", "SDS", "Senior Data Scientist", "DEVELOPER"),
            new DesignationData("ML Engineer", "MLE", "Machine Learning Engineer", "DEVELOPER"),
            new DesignationData("Data Science Manager", "DSM", "Data Science Manager", "PROJECT_MANAGER"),
            
            // HR
            new DesignationData("HR Coordinator", "HRC", "HR Coordinator", "DEVELOPER"),
            new DesignationData("HR Manager", "HRM", "HR Manager", "PROJECT_MANAGER"),
            new DesignationData("VP of HR", "VPHR", "Vice President of HR", "ORG_ADMIN"),
            
            // Finance
            new DesignationData("Accountant", "ACC", "Accountant", "DEVELOPER"),
            new DesignationData("Finance Manager", "FM", "Finance Manager", "PROJECT_MANAGER"),
            new DesignationData("CFO", "CFO", "Chief Financial Officer", "ORG_ADMIN"),
            
            // Sales
            new DesignationData("Sales Representative", "SR", "Sales Representative", "DEVELOPER"),
            new DesignationData("Account Executive", "AE", "Account Executive", "DEVELOPER"),
            new DesignationData("Sales Manager", "SM", "Sales Manager", "PROJECT_MANAGER"),
            new DesignationData("VP of Sales", "VPS", "Vice President of Sales", "ORG_ADMIN"),
            
            // Marketing
            new DesignationData("Marketing Coordinator", "MC", "Marketing Coordinator", "DEVELOPER"),
            new DesignationData("Marketing Manager", "MM", "Marketing Manager", "PROJECT_MANAGER"),
            new DesignationData("VP of Marketing", "VPM", "Vice President of Marketing", "ORG_ADMIN"),
            
            // Customer Success
            new DesignationData("Customer Success Representative", "CSR", "Customer Success Rep", "DEVELOPER"),
            new DesignationData("Customer Success Manager", "CSM", "Customer Success Manager", "PROJECT_MANAGER"),
            
            // IT Support
            new DesignationData("IT Support Specialist", "ITS", "IT Support Specialist", "DEVELOPER"),
            new DesignationData("IT Manager", "ITM", "IT Manager", "PROJECT_MANAGER"),
            
            // Executive
            new DesignationData("CEO", "CEO", "Chief Executive Officer", "SUPER_ADMIN"),
            new DesignationData("COO", "COO", "Chief Operating Officer", "ORG_ADMIN")
        );
        
        for (DesignationData data : designations) {
            if (!designationRepository.existsByTitleAndOrganizationId(data.title, org.getId())) {
                Designation desig = new Designation();
                desig.setTitle(data.title);
                desig.setCode(data.code);
                desig.setDescription(data.description);
                desig.setOrganizationId(org.getId());
                desig.setActive(true);
                designationRepository.save(desig);
                log.info("Created designation: {} -> Default Role: {}", data.title, data.defaultRole);
            }
        }
    }
    
    /**
     * Helper method to get default role for a designation
     */
    public String getDefaultRoleForDesignation(String designationTitle) {
        // Map designation titles to default roles
        Map<String, String> designationRoleMap = new HashMap<>();
        
        // Engineering
        designationRoleMap.put("Junior Software Engineer", "DEVELOPER");
        designationRoleMap.put("Software Engineer", "DEVELOPER");
        designationRoleMap.put("Senior Software Engineer", "DEVELOPER");
        designationRoleMap.put("Lead Software Engineer", "TEAM_LEAD");
        designationRoleMap.put("Engineering Manager", "PROJECT_MANAGER");
        designationRoleMap.put("Principal Engineer", "TEAM_LEAD");
        designationRoleMap.put("VP of Engineering", "ORG_ADMIN");
        designationRoleMap.put("CTO", "ORG_ADMIN");
        
        // QA
        designationRoleMap.put("QA Engineer", "DEVELOPER");
        designationRoleMap.put("Senior QA Engineer", "DEVELOPER");
        designationRoleMap.put("QA Lead", "TEAM_LEAD");
        designationRoleMap.put("QA Manager", "PROJECT_MANAGER");
        
        // Product
        designationRoleMap.put("Associate Product Manager", "DEVELOPER");
        designationRoleMap.put("Product Manager", "PROJECT_MANAGER");
        designationRoleMap.put("Senior Product Manager", "PROJECT_MANAGER");
        designationRoleMap.put("VP of Product", "ORG_ADMIN");
        
        // Design
        designationRoleMap.put("UI/UX Designer", "DEVELOPER");
        designationRoleMap.put("Senior Designer", "DEVELOPER");
        designationRoleMap.put("Design Lead", "TEAM_LEAD");
        designationRoleMap.put("Head of Design", "PROJECT_MANAGER");
        
        // DevOps
        designationRoleMap.put("DevOps Engineer", "DEVELOPER");
        designationRoleMap.put("Senior DevOps Engineer", "DEVELOPER");
        designationRoleMap.put("DevOps Lead", "TEAM_LEAD");
        designationRoleMap.put("Infrastructure Manager", "PROJECT_MANAGER");
        
        // Data Science
        designationRoleMap.put("Data Analyst", "DEVELOPER");
        designationRoleMap.put("Data Scientist", "DEVELOPER");
        designationRoleMap.put("Senior Data Scientist", "DEVELOPER");
        designationRoleMap.put("ML Engineer", "DEVELOPER");
        designationRoleMap.put("Data Science Manager", "PROJECT_MANAGER");
        
        // Other departments
        designationRoleMap.put("HR Coordinator", "DEVELOPER");
        designationRoleMap.put("HR Manager", "PROJECT_MANAGER");
        designationRoleMap.put("VP of HR", "ORG_ADMIN");
        designationRoleMap.put("Accountant", "DEVELOPER");
        designationRoleMap.put("Finance Manager", "PROJECT_MANAGER");
        designationRoleMap.put("CFO", "ORG_ADMIN");
        designationRoleMap.put("Sales Representative", "DEVELOPER");
        designationRoleMap.put("Account Executive", "DEVELOPER");
        designationRoleMap.put("Sales Manager", "PROJECT_MANAGER");
        designationRoleMap.put("VP of Sales", "ORG_ADMIN");
        designationRoleMap.put("Marketing Coordinator", "DEVELOPER");
        designationRoleMap.put("Marketing Manager", "PROJECT_MANAGER");
        designationRoleMap.put("VP of Marketing", "ORG_ADMIN");
        designationRoleMap.put("Customer Success Representative", "DEVELOPER");
        designationRoleMap.put("Customer Success Manager", "PROJECT_MANAGER");
        designationRoleMap.put("IT Support Specialist", "DEVELOPER");
        designationRoleMap.put("IT Manager", "PROJECT_MANAGER");
        designationRoleMap.put("CEO", "SUPER_ADMIN");
        designationRoleMap.put("COO", "ORG_ADMIN");
        
        return designationRoleMap.getOrDefault(designationTitle, "DEVELOPER");
    }
    
    /**
     * Creates sample employees with different designations to demonstrate role assignment
     */
    private void createSampleEmployees(Organization org) {
        List<SampleEmployeeData> sampleEmployees = Arrays.asList(
            new SampleEmployeeData("Priya", "Sharma", "priya.sharma@system.com", "Engineering", "Senior Software Engineer", "EMP-ENG-002"),
            new SampleEmployeeData("Amit", "Patel", "amit.patel@system.com", "Engineering", "Lead Software Engineer", "EMP-ENG-003"),
            new SampleEmployeeData("Sneha", "Reddy", "sneha.reddy@system.com", "Quality Assurance", "QA Lead", "EMP-QA-001"),
            new SampleEmployeeData("Vikram", "Singh", "vikram.singh@system.com", "Product Management", "Product Manager", "EMP-PM-001"),
            new SampleEmployeeData("Ananya", "Iyer", "ananya.iyer@system.com", "Design", "UI/UX Designer", "EMP-DES-001"),
            new SampleEmployeeData("Arjun", "Mehta", "arjun.mehta@system.com", "DevOps", "DevOps Engineer", "EMP-DO-001"),
            new SampleEmployeeData("Kavya", "Nair", "kavya.nair@system.com", "Human Resources", "HR Manager", "EMP-HR-001"),
            new SampleEmployeeData("Rohan", "Gupta", "rohan.gupta@system.com", "Engineering", "Engineering Manager", "EMP-ENG-004")
        );
        
        for (SampleEmployeeData data : sampleEmployees) {
            if (userRepository.findByEmail(data.email).isPresent()) {
                log.info("Sample employee {} already exists – skipping", data.email);
                continue;
            }
            
            // Find department
            Department dept = departmentRepository.findByOrganizationId(org.getId()).stream()
                    .filter(d -> d.getName().equals(data.departmentName))
                    .findFirst()
                    .orElse(null);
            
            if (dept == null) {
                log.warn("Department {} not found for sample employee {}", data.departmentName, data.email);
                continue;
            }
            
            // Find designation
            Designation desig = designationRepository.findByOrganizationId(org.getId()).stream()
                    .filter(d -> d.getTitle().equals(data.designationTitle))
                    .findFirst()
                    .orElse(null);
            
            if (desig == null) {
                log.warn("Designation {} not found for sample employee {}", data.designationTitle, data.email);
                continue;
            }
            
            // Determine role based on designation
            String roleName = getDefaultRoleForDesignation(data.designationTitle);
            Role role = roleRepository.findByNameAndOrganizationId(roleName, org.getId())
                    .orElseThrow(() -> new IllegalStateException("Role " + roleName + " not found"));
            
            // Create user
            User user = new User();
            user.setUsername(data.employeeCode.toLowerCase());
            user.setEmail(data.email);
            user.setPassword(passwordEncoder.encode("Welcome@123"));
            user.setStatus(UserStatus.ACTIVE);
            user.setOrganizationId(org.getId());
            user.setRoles(Set.of(role));
            
            User savedUser = userRepository.save(user);
            
            // Create employee with Indian phone numbers
            Employee employee = Employee.builder()
                    .employeeCode(data.employeeCode)
                    .firstName(data.firstName)
                    .lastName(data.lastName)
                    .email(data.email)
                    .phone("+91-" + String.format("%05d-%05d", 
                            90000 + (int)(Math.random() * 10000), 
                            10000 + (int)(Math.random() * 90000)))
                    .joiningDate(LocalDate.now().minusMonths((long)(Math.random() * 12)))
                    .status(com.dev.core.constants.EmployeeStatus.ACTIVE)
                    .profileStatus(com.dev.core.constants.ProfileStatus.OPENED)
                    .department(dept)
                    .designation(desig)
                    .user(savedUser)
                    .policyAcknowledgment(true)
                    .ndaSigned(true)
                    .securityTraining(true)
                    .build();
            
            employeeRepository.save(employee);
            
            log.info("Created sample employee: {} {} ({}) - Department: {}, Designation: {}, Role: {}",
                    data.firstName, data.lastName, data.employeeCode, 
                    data.departmentName, data.designationTitle, roleName);
        }
    }
    
    // Helper class for sample employee data
    private static class SampleEmployeeData {
        String firstName;
        String lastName;
        String email;
        String departmentName;
        String designationTitle;
        String employeeCode;
        
        SampleEmployeeData(String firstName, String lastName, String email, 
                          String departmentName, String designationTitle, String employeeCode) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.departmentName = departmentName;
            this.designationTitle = designationTitle;
            this.employeeCode = employeeCode;
        }
    }
    
    // Helper classes for data
    private static class DepartmentData {
        String name;
        String code;
        String description;
        
        DepartmentData(String name, String code, String description) {
            this.name = name;
            this.code = code;
            this.description = description;
        }
    }
    
    private static class DesignationData {
        String title;
        String code;
        String description;
        String defaultRole;
        
        DesignationData(String title, String code, String description, String defaultRole) {
            this.title = title;
            this.code = code;
            this.description = description;
            this.defaultRole = defaultRole;
        }
    }
}