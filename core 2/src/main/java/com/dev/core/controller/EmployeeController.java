package com.dev.core.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.core.api.ControllerHelper;
import com.dev.core.constants.ProfileStatus;
import com.dev.core.model.EmployeeAssetDTO;
import com.dev.core.model.EmployeeDTO;
import com.dev.core.service.EmployeeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Slf4j
public class EmployeeController {

    private final EmployeeService employeeService;
    private final ControllerHelper helper;
    

    // ------------------------------------------------------------
    // CRUD
    // ------------------------------------------------------------

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EmployeeDTO dto) {
        EmployeeDTO created = employeeService.createEmployee(dto);
        return helper.success("Employee created successfully", created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        EmployeeDTO updated = employeeService.updateEmployee(id, dto);
        return helper.success("Employee updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return helper.success("Employee deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return helper.success("Employee fetched", employeeService.getEmployeeById(id));
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam Long organizationId) {
        List<EmployeeDTO> list = employeeService.getAllEmployees(organizationId);
        return helper.success("Employees fetched", list);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam Long organizationId,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {

        Page<EmployeeDTO> page = employeeService.searchEmployees(organizationId, keyword, pageable);
        return helper.success("Employees search results", page);
    }

    // ------------------------------------------------------------
    // Lifecycle Actions
    // ------------------------------------------------------------

    @PutMapping("/{id}/promote")
    public ResponseEntity<?> promote(
            @PathVariable Long id,
            @RequestParam(required = false) String newDesignation,
            @RequestParam(required = false) String newDepartment) {

        employeeService.promoteEmployee(id, newDesignation, newDepartment);
        return helper.success("Employee promoted successfully");
    }

    @PutMapping("/{id}/resign")
    public ResponseEntity<?> resign(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks) {

        employeeService.markAsResigned(id, remarks);
        return helper.success("Employee marked as resigned");
    }

    // ------------------------------------------------------------
    // Team assignment
    // ------------------------------------------------------------

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignToTeam(
            @PathVariable Long id,
            @RequestParam Long teamId,
            @RequestParam(defaultValue = "false") boolean isLead) {

        employeeService.assignToTeam(id, teamId, isLead);
        return helper.success("Employee assigned to team");
    }

    @DeleteMapping("/{id}/team/{teamId}")
    public ResponseEntity<?> removeFromTeam(@PathVariable Long id, @PathVariable Long teamId) {
        employeeService.removeFromTeam(id, teamId);
        return helper.success("Employee removed from team");
    }

    // ------------------------------------------------------------
    // Profile Status
    // ------------------------------------------------------------

    @PatchMapping("/{id}/profile/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam ProfileStatus status) {

        employeeService.updateProfileStatus(id, status);
        return helper.success("Profile status updated");
    }

    // ------------------------------------------------------------
    // Manager Assignment
    // ------------------------------------------------------------

    @PutMapping("/{id}/manager/{managerId}")
    public ResponseEntity<?> assignManager(
            @PathVariable Long id,
            @PathVariable Long managerId) {

        employeeService.assignManager(id, managerId);
        return helper.success("Manager assigned to employee");
    }

    @DeleteMapping("/{id}/manager")
    public ResponseEntity<?> removeManager(@PathVariable Long id) {
        employeeService.removeManager(id);
        return helper.success("Manager removed from employee");
    }

    // ------------------------------------------------------------
    // Assets
    // ------------------------------------------------------------

    @PostMapping("/{id}/assets")
    public ResponseEntity<?> addAsset(
            @PathVariable Long id,
            @RequestBody EmployeeAssetDTO assetDTO) {

        EmployeeAssetDTO created = employeeService.addAsset(id, assetDTO);
        return helper.success("Asset added to employee", created);
    }

    @DeleteMapping("/assets/{assetId}")
    public ResponseEntity<?> removeAsset(@PathVariable Long assetId) {
        employeeService.removeAsset(assetId);
        return helper.success("Asset removed from employee");
    }

    @GetMapping("/{id}/assets")
    public ResponseEntity<?> getEmployeeAssets(@PathVariable Long id) {
        return helper.success("Employee assets fetched", employeeService.getEmployeeAssets(id));
    }
}
