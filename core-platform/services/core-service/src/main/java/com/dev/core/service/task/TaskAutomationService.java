package com.dev.core.service.task;

public interface TaskAutomationService {

    void onTaskCreated(Long taskId);

    void onTaskAssigned(Long taskId, Long userId);

    void onTaskStatusChanged(Long taskId, String oldStatus, String newStatus);

    void onTaskPriorityChanged(Long taskId, String oldPriority, String newPriority);

    void onTaskDueSoon(Long taskId);

    void onTaskOverdue(Long taskId);

    void onTaskCompleted(Long taskId);

    void onSubtaskAllDone(Long parentTaskId);

    void onTaskCommentAdded(Long taskId, Long commentId);

    void onTaskAttachmentAdded(Long taskId, Long attachmentId);

    void onTaskDeleted(Long taskId);

    void onDependencyResolved(Long taskId, Long dependencyId);
}
