package com.dev.core.service.bug;

public interface BugAutomationService {

    void onBugReported(Long bugId);

    void onBugAssigned(Long bugId, Long assigneeId);

    void onBugStatusChanged(Long bugId, String oldStatus, String newStatus);

    void onBugSeverityChanged(Long bugId, String oldSeverity, String newSeverity);

    void onBugResolved(Long bugId);

    void onBugClosed(Long bugId);

    void onBugReopened(Long bugId);

    void onBugDueSoon(Long bugId);

    void onBugOverdue(Long bugId);
}
