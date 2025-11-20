package com.dev.core.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.constants.ProfileStatus;
import com.dev.core.constants.UserStatus;
import com.dev.core.domain.Department;
import com.dev.core.domain.Designation;
import com.dev.core.domain.Employee;
import com.dev.core.domain.EmployeeAsset;
import com.dev.core.domain.EmployeeDocument;
import com.dev.core.domain.EmploymentHistory;
import com.dev.core.domain.TeamMember;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.EmployeeAssetMapper;
import com.dev.core.mapper.EmployeeMapper;
import com.dev.core.model.EmployeeAssetDTO;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.DepartmentRepository;
import com.dev.core.repository.DesignationRepository;
import com.dev.core.repository.EmployeeAssetRepository;
import com.dev.core.repository.EmployeeDocumentRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.EmploymentHistoryRepository;
import com.dev.core.repository.TeamMemberRepository;
import com.dev.core.repository.TeamRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.EmployeeService;
import com.dev.core.service.NotificationService;
import com.dev.core.service.UserService;
import com.dev.core.service.validation.EmployeeValidator;
import com.dev.core.specification.SpecificationBuilder;
import com.dev.core.util.EmployeeCodeHelper;
import com.dev.core.util.PasswordGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EmployeeDocumentRepository documentRepository;
    private final EmploymentHistoryRepository historyRepository;

    private final EmployeeValidator employeeValidator;
    private final AuthorizationService authorizationService;
    private final UserService userService;

    private final NotificationService notificationService;
    private final EmployeeAssetRepository employeeAssetRepository;
    private final SecurityContextUtil securityContext;
   

    /**
     * Helper for RBAC authorization
     */
    private void authorize(String action) {
        authorizationService.authorize("EMPLOYEE", action);
    }

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    @Override
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        authorize("CREATE");
        employeeValidator.validateBeforeCreate(dto);

        Employee entity = EmployeeMapper.toEntity(dto);

        // Link department & designation
        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ValidationFailedException("error.department.notfound",
                            new Object[]{dto.getDepartmentId()}));
            entity.setDepartment(dept);
        }

        if (dto.getDesignationId() != null) {
            Designation desig = designationRepository.findById(dto.getDesignationId())
                    .orElseThrow(() -> new ValidationFailedException("error.designation.notfound",
                            new Object[]{dto.getDesignationId()}));
            entity.setDesignation(desig);
        }

     // NEW FIELDS
        if (dto.getDob() != null) entity.setDob(dto.getDob());
        if (dto.getAddress() != null) entity.setAddress(dto.getAddress());
        if (dto.getEmergencyContact() != null) entity.setEmergencyContact(dto.getEmergencyContact());
        if (dto.getEmergencyPhone() != null) entity.setEmergencyPhone(dto.getEmergencyPhone());

        if (dto.getWorkEmail() != null) entity.setWorkEmail(dto.getWorkEmail());
        if (dto.getSystemAccess() != null) entity.setSystemAccess(dto.getSystemAccess());

        if (dto.getPolicyAcknowledgment() != null) entity.setPolicyAcknowledgment(dto.getPolicyAcknowledgment());
        if (dto.getNdaSigned() != null) entity.setNdaSigned(dto.getNdaSigned());
        if (dto.getSecurityTraining() != null) entity.setSecurityTraining(dto.getSecurityTraining());
        if (dto.getToolsTraining() != null) entity.setToolsTraining(dto.getToolsTraining());

        if (dto.getManager().getId() != null) {
            Employee manager = employeeRepository.findById(dto.getManager().getId())
                    .orElseThrow(() -> new ValidationFailedException("error.manager.notfound", new Object[]{dto.getManager().getId()}));
            entity.setManager(manager);
        }

        // Default status
        if (entity.getStatus() == null)
            entity.setStatus(dto.getStatus() != null ? dto.getStatus() : com.dev.core.constants.EmployeeStatus.ACTIVE);
        entity.setEmployeeCode(EmployeeCodeHelper.generateEmployeeCode(dto.getDepartment().getName()));
        entity.setProfileStatus(ProfileStatus.OPENED);
        entity.setOrganizationId(securityContext.getCurrentOrganizationId());
        entity.setJoiningDate(LocalDate.now());
        Employee saved = employeeRepository.save(entity);
        log.info("✅ Employee created: {} ({})", saved.getFirstName(), saved.getEmail());
        
        UserDTO userDto = new UserDTO();
        userDto.setOrganizationId(saved.getOrganizationId());
        userDto.setUsername(saved.getEmployeeCode());  // OR saved.getEmail() — your choice
        userDto.setEmail(saved.getFirstName()+"."+saved.getLastName()+"@core.com");
        userDto.setPassword(PasswordGenerator.generatePassword()); // or auto-generate
        userDto.setStatus(UserStatus.ACTIVE);

        UserDTO createdUser = userService.createUserForEmployee(saved.getId(), userDto);
        
        try {
            notificationService.sendTemplateEmail(
                    saved.getEmail(),
                    "Welcome to the Company!",
                    "employee-welcome",
                    saved
            );
        } catch (Exception ex) {
            notificationService.handleNotificationFailure(saved.getEmail(), "Failed to send welcome email", ex);
        }


        log.info("🔐 Login created for employee {} with userId={}", saved.getId(), createdUser.getId());


        return EmployeeMapper.toDTO(saved);
    }

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        authorize("UPDATE");
        employeeValidator.validateBeforeUpdate(id, dto);

        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{id}));

        if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
        if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
        if (dto.getPhone() != null) existing.setPhone(dto.getPhone());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ValidationFailedException("error.department.notfound",
                            new Object[]{dto.getDepartmentId()}));
            existing.setDepartment(dept);
        }

        if (dto.getDesignationId() != null) {
            Designation desig = designationRepository.findById(dto.getDesignationId())
                    .orElseThrow(() -> new ValidationFailedException("error.designation.notfound",
                            new Object[]{dto.getDesignationId()}));
            existing.setDesignation(desig);
        }
     // NEW SIMPLE FIELDS
        if (dto.getDob() != null) existing.setDob(dto.getDob());
        if (dto.getAddress() != null) existing.setAddress(dto.getAddress());
        if (dto.getEmergencyContact() != null) existing.setEmergencyContact(dto.getEmergencyContact());
        if (dto.getEmergencyPhone() != null) existing.setEmergencyPhone(dto.getEmergencyPhone());

        if (dto.getWorkEmail() != null) existing.setWorkEmail(dto.getWorkEmail());
        if (dto.getSystemAccess() != null) existing.setSystemAccess(dto.getSystemAccess());

        if (dto.getPolicyAcknowledgment() != null) existing.setPolicyAcknowledgment(dto.getPolicyAcknowledgment());
        if (dto.getNdaSigned() != null) existing.setNdaSigned(dto.getNdaSigned());
        if (dto.getSecurityTraining() != null) existing.setSecurityTraining(dto.getSecurityTraining());
        if (dto.getToolsTraining() != null) existing.setToolsTraining(dto.getToolsTraining());

        if (dto.getManagerId() != null) {
            Employee manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ValidationFailedException("error.manager.notfound", new Object[]{dto.getManagerId()}));
            existing.setManager(manager);
        }


        Employee updated = employeeRepository.save(existing);
        log.info("✏️ Employee updated: {}", updated.getEmail());

        return EmployeeMapper.toDTO(updated);
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    @Override
    public void deleteEmployee(Long id) {
        authorize("DELETE");
        if (id == null)
            throw new ValidationFailedException("error.employee.id.required");

        if (!employeeRepository.existsById(id))
            throw new ValidationFailedException("error.employee.notfound", new Object[]{id});

        employeeRepository.deleteById(id);
        log.info("🗑️ Employee deleted: {}", id);
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public EmployeeDTO getEmployeeById(Long id) {
        authorize("READ");
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{id}));
        return EmployeeMapper.toDTO(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeDTO> getAllEmployees(Long organizationId, Pageable pageable) {
        authorize("READ");

        return employeeRepository.findByOrganizationId(organizationId, pageable)
                .map(EmployeeMapper::toDTO); // Page.map() is efficient
    }


    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeDTO> searchEmployees(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");
        Page<Employee> page = employeeRepository.findAll(
                SpecificationBuilder.of(Employee.class)
                        .equals("organizationId", organizationId)
                        .contains("firstName", keyword)
                        .contains("lastName", keyword)
                        .contains("email", keyword)
                        .build(),
                pageable
        );
        return page.map(EmployeeMapper::toDTO);
    }

    // ---------------------------------------------------------------------
    // TEAM ASSIGNMENT
    // ---------------------------------------------------------------------
    @Override
    public void assignToTeam(Long employeeId, Long teamId, boolean isLead) {
        authorize("UPDATE");
        teamRepository.findById(teamId)
                .orElseThrow(() -> new ValidationFailedException("error.team.notfound", new Object[]{teamId}));
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        boolean exists = teamMemberRepository.existsByTeam_IdAndEmployee_Id(teamId, employeeId);
        if (exists)
            throw new ValidationFailedException("error.teammember.exists", new Object[]{employeeId, teamId});

        TeamMember member = new TeamMember();
        member.setTeam(teamRepository.getReferenceById(teamId));
        member.setEmployee(employeeRepository.getReferenceById(employeeId));
        member.setLead(isLead);
        member.setManager(false);
        member.setOrganizationId(member.getTeam().getOrganizationId());
        teamMemberRepository.save(member);

        log.info("👥 Employee {} assigned to team {} (Lead={})", employeeId, teamId, isLead);
    }

    @Override
    public void removeFromTeam(Long employeeId, Long teamId) {
        authorize("UPDATE");
        teamMemberRepository.findByTeam_Id(teamId).stream()
                .filter(m -> m.getEmployee().getId().equals(employeeId))
                .findFirst()
                .ifPresentOrElse(member -> {
                    teamMemberRepository.delete(member);
                    log.info("👋 Employee {} removed from team {}", employeeId, teamId);
                }, () -> {
                    throw new ValidationFailedException("error.teammember.notfound",
                            new Object[]{employeeId, teamId});
                });
    }

    // ---------------------------------------------------------------------
    // LIFECYCLE
    // ---------------------------------------------------------------------
    @Override
    public void markAsResigned(Long employeeId, String remarks) {
        authorize("UPDATE");
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        emp.setStatus(com.dev.core.constants.EmployeeStatus.RESIGNED);
        emp.setExitDate(LocalDate.now());
        employeeRepository.save(emp);

        // Add to employment history
        EmploymentHistory hist = new EmploymentHistory();
        hist.setEmployee(emp);
        hist.setPreviousDepartment(emp.getDepartment() != null ? emp.getDepartment().getName() : null);
        hist.setPreviousDesignation(emp.getDesignation() != null ? emp.getDesignation().getTitle() : null);
        hist.setNewDepartment(null);
        hist.setNewDesignation("Resigned");
        hist.setEffectiveDate(LocalDate.now());
        hist.setRemarks(remarks);
        hist.setOrganizationId(emp.getOrganizationId());
        historyRepository.save(hist);

        log.info("🚪 Employee {} marked as resigned", employeeId);
    }

    @Override
    public void promoteEmployee(Long employeeId, String newDesignation, String newDepartment) {
        authorize("UPDATE");
        employeeValidator.validateForPromotion(employeeId, newDesignation, newDepartment);

        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        String oldDept = emp.getDepartment() != null ? emp.getDepartment().getName() : null;
        String oldDesig = emp.getDesignation() != null ? emp.getDesignation().getTitle() : null;

        if (newDepartment != null) {
            Department dept = departmentRepository.findById(Long.valueOf(newDepartment))
                    .orElseThrow(() -> new ValidationFailedException("error.department.notfound", new Object[]{newDepartment}));
            emp.setDepartment(dept);
        }
        if (newDesignation != null) {
            Designation desig = designationRepository.findById(Long.valueOf(newDesignation))
                    .orElseThrow(() -> new ValidationFailedException("error.designation.notfound", new Object[]{newDesignation}));
            emp.setDesignation(desig);
        }

        employeeRepository.save(emp);

        EmploymentHistory hist = new EmploymentHistory();
        hist.setEmployee(emp);
        hist.setPreviousDepartment(oldDept);
        hist.setPreviousDesignation(oldDesig);
        hist.setNewDepartment(emp.getDepartment() != null ? emp.getDepartment().getName() : null);
        hist.setNewDesignation(emp.getDesignation() != null ? emp.getDesignation().getTitle() : null);
        hist.setEffectiveDate(LocalDate.now());
        hist.setOrganizationId(emp.getOrganizationId());
        historyRepository.save(hist);

        log.info("🎖️ Employee {} promoted to {}", employeeId, newDesignation);
    }

    // ---------------------------------------------------------------------
    // DOCUMENTS
    // ---------------------------------------------------------------------
    @Override
    public void uploadDocument(Long employeeId, String name, String type, String path) {
        authorize("UPDATE");
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        boolean exists = documentRepository.existsByEmployee_IdAndDocumentName(employeeId, name);
        if (exists)
            throw new ValidationFailedException("error.document.name.exists", new Object[]{name});

        EmployeeDocument doc = new EmployeeDocument();
        doc.setEmployee(emp);
        doc.setDocumentName(name);
        doc.setDocumentType(type);
        doc.setFilePath(path);
        doc.setVerified(false);
        doc.setOrganizationId(emp.getOrganizationId());
        documentRepository.save(doc);

        log.info("📎 Document '{}' uploaded for employee {}", name, employeeId);
    }

    @Override
    public void verifyDocument(Long documentId, boolean verified) {
        authorize("UPDATE");
        EmployeeDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ValidationFailedException("error.document.notfound", new Object[]{documentId}));
        doc.setVerified(verified);
        documentRepository.save(doc);
        log.info("✅ Document {} verification set to {}", documentId, verified);
    }

    // ---------------------------------------------------------------------
    // REPORTING HELPERS
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByDepartment(Long orgId, Long deptId) {
        authorize("READ");
        return employeeRepository.findByOrganizationIdAndDepartment_Id(orgId, deptId)
                .stream()
                .map(EmployeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByStatus(Long orgId, String status) {
        authorize("READ");
        var empStatus = com.dev.core.constants.EmployeeStatus.valueOf(status.toUpperCase());
        return employeeRepository.findByOrganizationIdAndStatus(orgId, empStatus)
                .stream()
                .map(EmployeeMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public void markProfileAsCompleted(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setProfileStatus(ProfileStatus.COMPLETED);
        
        notificationService.sendEmail(
                employee.getEmail(),
                "Profile Completed",
                "Your employee profile has been successfully completed."
        );


        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void updateProfileStatus(Long employeeId, ProfileStatus status) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setProfileStatus(status);
        notificationService.sendEmail(
                employee.getEmail(),
                "Profile Status Updated",
                "Your profile status has been updated to: " + status
        );


        employeeRepository.save(employee);
    }
    @Override
    public void assignManager(Long employeeId, Long managerId) {
        authorize("UPDATE");

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        Employee manager = employeeRepository.findById(managerId)
                .orElseThrow(() -> new ValidationFailedException("error.manager.notfound", new Object[]{managerId}));

        employee.setManager(manager);
        employeeRepository.save(employee);

        // Send notification to manager
        try {
            notificationService.sendEmail(
                    manager.getEmail(),
                    "New Team Member Assigned",
                    "You have been assigned as manager for employee: " + employee.getFirstName()
            );
        } catch (Exception ex) {
            notificationService.handleNotificationFailure(manager.getEmail(),
                    "Could not send manager assignment email", ex);
        }

        log.info("👔 Manager {} assigned to employee {}", managerId, employeeId);
    }

    @Override
    public void removeManager(Long employeeId) {
        authorize("UPDATE");

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        Employee oldManager = employee.getManager();

        if (oldManager == null) return;

        employee.setManager(null);
        employeeRepository.save(employee);

        // Notify previous manager
        try {
            notificationService.sendEmail(
                    oldManager.getEmail(),
                    "Manager Assignment Removed",
                    "You are no longer manager for employee: " + employee.getFirstName()
            );
        } catch (Exception ex) {
            notificationService.handleNotificationFailure(oldManager.getEmail(),
                    "Could not send manager removal email", ex);
        }

        log.info("❌ Manager {} removed from employee {}", oldManager.getId(), employeeId);
    }


    @Override
    public EmployeeAssetDTO addAsset(Long employeeId, EmployeeAssetDTO assetDTO) {
        authorize("UPDATE");

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        EmployeeAsset asset = EmployeeAssetMapper.toEntity(assetDTO);
        asset.setEmployee(employee);
        asset.setOrganizationId(employee.getOrganizationId());

        EmployeeAsset saved = employeeAssetRepository.save(asset);

        // Notify employee
        try {
            notificationService.sendEmail(
                    employee.getEmail(),
                    "New Asset Assigned",
                    "Asset assigned: " + asset.getAssetType()
            );
        } catch (Exception ex) {
            notificationService.handleNotificationFailure(employee.getEmail(),
                    "Failed to send asset assignment email", ex);
        }

        log.info("💻 Asset {} assigned to employee {}", saved.getAssetType(), employeeId);

        return EmployeeAssetMapper.toDTO(saved);
    }


    @Override
    public void removeAsset(Long assetId) {
        authorize("UPDATE");

        EmployeeAsset asset = employeeAssetRepository.findById(assetId)
                .orElseThrow(() -> new ValidationFailedException("error.asset.notfound", new Object[]{assetId}));

        Employee emp = asset.getEmployee();

        employeeAssetRepository.delete(asset);

        // Notify employee
        try {
            notificationService.sendEmail(
                    emp.getEmail(),
                    "Asset Removed",
                    "Asset removed: " + asset.getAssetType()
            );
        } catch (Exception ex) {
            notificationService.handleNotificationFailure(emp.getEmail(),
                    "Failed to send asset removal email", ex);
        }

        log.info("🗑️ Asset {} removed from employee {}", asset.getAssetType(), emp.getId());
    }


    @Override
    public List<EmployeeAssetDTO> getEmployeeAssets(Long employeeId) {
        authorize("READ");

        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ValidationFailedException("error.employee.notfound", new Object[]{employeeId}));

        return employeeAssetRepository.findByEmployee_Id(employeeId)
                .stream()
                .map(EmployeeAssetMapper::toDTO)
                .collect(Collectors.toList());
    }

	@Override
	public List<EmployeeDTO> getAllEmployees(Long organizationId) {
		// TODO Auto-generated method stub
		return null;
	}

    
   

    

}
