package com.dev.core.service.performance;


import java.util.Map;

public interface PerformanceAnalyticsService {

    Map<String, Object> getEmployeeSummary(Long employeeId);

    Map<String, Object> getDepartmentSummary(Long departmentId);

    Map<String, Object> getCycleSummary(Long cycleId);

}
