package com.dev.core.service.impl;

import com.dev.core.domain.*;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.*;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.repository.*;
import com.dev.core.service.*;
import com.dev.core.service.validation.EmployeeValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

        // Default status
        if (entity.getStatus() == null)
            entity.setStatus(dto.getStatus() != null ? dto.getStatus() : com.dev.core.constants.EmployeeStatus.ACTIVE);

        Employee saved = employeeRepository.save(entity);
        log.info("✅ Employee created: {} ({})", saved.getFirstName(), saved.getEmail());

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
            throw new ValidationFailedException("error.employee.id.required", "Employee ID is required");

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
    public List<EmployeeDTO> getAllEmployees(Long organizationId) {
        authorize("READ");
        return employeeRepository.findByOrganizationId(organizationId)
                .stream()
                .map(EmployeeMapper::toDTO)
                .collect(Collectors.toList());
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
}
