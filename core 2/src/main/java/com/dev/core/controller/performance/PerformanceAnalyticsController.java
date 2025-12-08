package com.dev.core.controller.performance;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.service.performance.PerformanceAnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/performance/analytics")
@RequiredArgsConstructor
public class PerformanceAnalyticsController {

    private final PerformanceAnalyticsService analyticsService;

    // -----------------------------------------------
    // EMPLOYEE SUMMARY
    // -----------------------------------------------
    @GetMapping("/employee/{employeeId}")
    public Map<String, Object> getEmployeeSummary(@PathVariable Long employeeId) {
        return analyticsService.getEmployeeSummary(employeeId);
    }

    // -----------------------------------------------
    // DEPARTMENT SUMMARY
    // -----------------------------------------------
    @GetMapping("/department/{departmentId}")
    public Map<String, Object> getDepartmentSummary(@PathVariable Long departmentId) {
        return analyticsService.getDepartmentSummary(departmentId);
    }

    // -----------------------------------------------
    // CYCLE SUMMARY
    // -----------------------------------------------
    @GetMapping("/cycle/{cycleId}")
    public Map<String, Object> getCycleSummary(@PathVariable Long cycleId) {
        return analyticsService.getCycleSummary(cycleId);
    }
}
