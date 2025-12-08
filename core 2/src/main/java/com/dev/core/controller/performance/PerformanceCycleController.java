package com.dev.core.controller.performance;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.dev.core.model.performance.PerformanceCycleDTO;
import com.dev.core.service.performance.PerformanceCycleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/performance/cycles")
@RequiredArgsConstructor
public class PerformanceCycleController {

    private final PerformanceCycleService cycleService;

    // Create new cycle
    @PostMapping
    public PerformanceCycleDTO createCycle(
            @RequestParam Integer year,
            @RequestParam Integer quarter,
            @RequestParam Long organizationId) {
        return cycleService.createCycle(year, quarter, organizationId);
    }

    // Get active cycle
    @GetMapping("/active/{organizationId}")
    public PerformanceCycleDTO getActiveCycle(@PathVariable Long organizationId) {
        return cycleService.getActiveCycle(organizationId);
    }

    // List all cycles for org
    @GetMapping("/organization/{organizationId}")
    public List<PerformanceCycleDTO> listCycles(@PathVariable Long organizationId) {
        return cycleService.listCycles(organizationId);
    }

    // Close cycle
    @PostMapping("/{cycleId}/close")
    public boolean closeCycle(@PathVariable Long cycleId) {
        return cycleService.closeCycle(cycleId);
    }
}
