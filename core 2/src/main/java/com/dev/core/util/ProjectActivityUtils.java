package com.dev.core.util;

import com.dev.core.constants.ProjectActivityType;
import com.dev.core.model.ProjectActivityDTO;

import java.util.*;

public final class ProjectActivityUtils {

    private ProjectActivityUtils() {}

    // ==========================================================
    //  GENERIC BUILDER
    // ==========================================================

    public static ProjectActivityDTO build(
            Long projectId,
            Long performedBy,
            ProjectActivityType type,
            String summary,
            String description,
            Map<String, Object> metadata
    ) {
        return ProjectActivityDTO.builder()
                .projectId(projectId)
                .performedBy(performedBy)
                .activityType(type)
                .summary(summary)
                .description(description)
                .metadata(metadata)
                .build();
    }

    // ==========================================================
    //  COMMON ACTIVITY HELPERS
    // ==========================================================

    // ---------- STATUS CHANGE ----------
    public static ProjectActivityDTO statusChanged(
            Long projectId,
            Long userId,
            Object oldStatus,
            Object newStatus
    ) {
        String summary = "Status changed from " + oldStatus + " to " + newStatus;

        Map<String, Object> meta = Map.of(
                "oldStatus", oldStatus,
                "newStatus", newStatus
        );

        return build(projectId, userId, ProjectActivityType.STATUS_CHANGED, summary, null, meta);
    }

    // ---------- PRIORITY CHANGE ----------
    public static ProjectActivityDTO priorityChanged(
            Long projectId,
            Long userId,
            Object oldPriority,
            Object newPriority
    ) {
        String summary = "Priority changed from " + oldPriority + " to " + newPriority;

        Map<String, Object> meta = Map.of(
                "oldPriority", oldPriority,
                "newPriority", newPriority
        );

        return build(projectId, userId, ProjectActivityType.PRIORITY_CHANGED, summary, null, meta);
    }

    // ---------- TAGS UPDATED ----------
    public static ProjectActivityDTO tagsUpdated(
            Long projectId,
            Long userId,
            Set<String> previous,
            Set<String> updated
    ) {
        Set<String> added = new HashSet<>(updated);
        added.removeAll(previous);

        Set<String> removed = new HashSet<>(previous);
        removed.removeAll(updated);

        String summary = "Tags updated. Added: " + added + ", Removed: " + removed;

        Map<String, Object> meta = Map.of(
                "previousTags", previous,
                "updatedTags", updated,
                "added", added,
                "removed", removed
        );

        return build(projectId, userId, ProjectActivityType.TAG_UPDATED, summary, null, meta);
    }

    // ---------- MEMBER ADDED ----------
    public static ProjectActivityDTO memberAdded(
            Long projectId,
            Long userId,
            Long addedUserId,
            String addedUserName
    ) {
        String summary = addedUserName + " was added to the project.";

        Map<String, Object> meta = Map.of(
                "addedUserId", addedUserId,
                "addedUserName", addedUserName
        );

        return build(projectId, userId, ProjectActivityType.MEMBER_ADDED, summary, null, meta);
    }

    // ---------- MEMBER REMOVED ----------
    public static ProjectActivityDTO memberRemoved(
            Long projectId,
            Long userId,
            Long removedUserId,
            String removedUserName
    ) {
        String summary = removedUserName + " was removed from the project.";

        Map<String, Object> meta = Map.of(
                "removedUserId", removedUserId,
                "removedUserName", removedUserName
        );

        return build(projectId, userId, ProjectActivityType.MEMBER_REMOVED, summary, null, meta);
    }

    // ---------- FILE UPLOADED ----------
    public static ProjectActivityDTO fileUploaded(
            Long projectId,
            Long userId,
            String fileName
    ) {
        String summary = "File uploaded: " + fileName;

        Map<String, Object> meta = Map.of(
                "fileName", fileName
        );

        return build(projectId, userId, ProjectActivityType.FILE_UPLOADED, summary, null, meta);
    }

    // ---------- FILE DELETED ----------
    public static ProjectActivityDTO fileDeleted(
            Long projectId,
            Long userId,
            String fileName
    ) {
        String summary = "File deleted: " + fileName;

        Map<String, Object> meta = Map.of(
                "fileName", fileName
        );

        return build(projectId, userId, ProjectActivityType.FILE_DELETED, summary, null, meta);
    }

    // ---------- PROGRESS UPDATED ----------
    public static ProjectActivityDTO progressUpdated(
            Long projectId,
            Long userId,
            Integer oldProgress,
            Integer newProgress
    ) {
        String summary = "Progress updated from " + oldProgress + "% to " + newProgress + "%";

        Map<String, Object> meta = Map.of(
                "oldProgress", oldProgress,
                "newProgress", newProgress
        );

        return build(projectId, userId, ProjectActivityType.PROGRESS_UPDATED, summary, null, meta);
    }

    // ---------- BUDGET UPDATED ----------
    public static ProjectActivityDTO budgetUpdated(
            Long projectId,
            Long userId,
            Double oldBudget,
            Double newBudget
    ) {
        String summary = "Budget updated from " + oldBudget + " to " + newBudget;

        Map<String, Object> meta = Map.of(
                "oldBudget", oldBudget,
                "newBudget", newBudget
        );

        return build(projectId, userId, ProjectActivityType.BUDGET_UPDATED, summary, null, meta);
    }
}
