package com.dev.core.service;


import java.util.Map;

public interface ProjectAnalyticsService {

    /**
     * Returns aggregated metrics for a project (progress %, total phases, completed phases, etc.)
     */
    Map<String, Object> getProjectMetrics(Long projectId);

    /**
     * Organization-wide project analytics (for dashboards).
     */
    Map<String, Object> getOrganizationProjectSummary(Long organizationId);
}
