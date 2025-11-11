package com.dev.core.controller;

import com.dev.core.model.DepartmentDTO;
import com.dev.core.service.DepartmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<DepartmentDTO> create(@RequestBody DepartmentDTO dto) {
        return ResponseEntity.ok(departmentService.createDepartment(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDTO> update(@PathVariable Long id, @RequestBody DepartmentDTO dto) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAll(@RequestParam Long organizationId) {
        return ResponseEntity.ok(departmentService.getAllDepartments(organizationId));
    }

    // 🔹 Analytics
    @GetMapping("/{id}/employees/count")
    public ResponseEntity<Long> getEmployeeCount(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getEmployeeCount(id));
    }

    @GetMapping("/{id}/teams/count")
    public ResponseEntity<Long> getTeamCount(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getTeamCount(id));
    }
}
