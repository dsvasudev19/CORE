package com.dev.core.service.performance;
public interface PerformanceReviewSchedulerService {

    /**
     * Manually generate review requests for the current quarter.
     * Same logic scheduler uses.
     */
    void generateQuarterlyRequests();

	/** Convenience API to manually trigger from admin UI or tests */
	void triggerNow();

}
