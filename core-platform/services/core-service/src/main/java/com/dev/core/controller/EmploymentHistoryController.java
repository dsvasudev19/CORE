package com.dev.core.controller;

import com.dev.core.model.EmploymentHistoryDTO;
import com.dev.core.service.EmploymentHistoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employment-history")
@RequiredArgsConstructor
public class EmploymentHistoryController {

    private final EmploymentHistoryService historyService;

    @PostMapping
    public ResponseEntity<EmploymentHistoryDTO> create(@RequestBody EmploymentHistoryDTO dto) {
        return ResponseEntity.ok(historyService.createHistory(dto));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmploymentHistoryDTO>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(historyService.getHistoryByEmployee(employeeId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        historyService.deleteHistory(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Analytics
    @GetMapping("/analytics/promotions")
    public ResponseEntity<Long> countPromotions(@RequestParam Long organizationId) {
        return ResponseEntity.ok(historyService.countPromotions(organizationId));
    }

    @GetMapping("/analytics/resignations")
    public ResponseEntity<Long> countResignations(@RequestParam Long organizationId) {
        return ResponseEntity.ok(historyService.countResignations(organizationId));
    }
}
