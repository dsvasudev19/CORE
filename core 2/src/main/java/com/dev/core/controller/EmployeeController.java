package com.dev.core.controller;

import com.dev.core.model.EmployeeDTO;
import com.dev.core.service.EmployeeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Slf4j
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.createEmployee(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> update(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAll(@RequestParam Long organizationId) {
        return ResponseEntity.ok(employeeService.getAllEmployees(organizationId));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeDTO>> search(
            @RequestParam Long organizationId,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(employeeService.searchEmployees(organizationId, keyword, pageable));
    }

    // 🔹 Lifecycle Actions
    @PutMapping("/{id}/promote")
    public ResponseEntity<Void> promote(
            @PathVariable Long id,
            @RequestParam(required = false) String newDesignation,
            @RequestParam(required = false) String newDepartment) {
        employeeService.promoteEmployee(id, newDesignation, newDepartment);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/resign")
    public ResponseEntity<Void> resign(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks) {
        employeeService.markAsResigned(id, remarks);
        return ResponseEntity.ok().build();
    }

    // 🔹 Team assignment
    @PostMapping("/{id}/assign")
    public ResponseEntity<Void> assignToTeam(
            @PathVariable Long id,
            @RequestParam Long teamId,
            @RequestParam(defaultValue = "false") boolean isLead) {
        employeeService.assignToTeam(id, teamId, isLead);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/team/{teamId}")
    public ResponseEntity<Void> removeFromTeam(@PathVariable Long id, @PathVariable Long teamId) {
        employeeService.removeFromTeam(id, teamId);
        return ResponseEntity.ok().build();
    }
}
