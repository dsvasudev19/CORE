package com.dev.core.service;


import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.dev.core.model.TimeLogDTO;

public interface TimeLogService {

    // ---------------------------------------------------------
    // TIMER OPERATIONS
    // ---------------------------------------------------------

    /**
     * Starts a new timer for a user.
     * Task or Bug is optional. Project will be auto-derived.
     */
    TimeLogDTO startTimer(Long userId, Long taskId, Long bugId, String note);

    /**
     * Stops the currently active timer for the user.
     */
    TimeLogDTO stopTimer(Long userId);

    /**
     * Gets the active timer entry for a user, if present.
     */
    TimeLogDTO getActiveTimer(Long userId);

    // ---------------------------------------------------------
    // CRUD OPERATIONS (manual time log entries)
    // ---------------------------------------------------------

    /**
     * Create a manual time entry (not timer-based).
     */
    TimeLogDTO createManualEntry(TimeLogDTO dto);

    /**
     * Update an existing time entry manually.
     */
    TimeLogDTO updateManualEntry(Long id, TimeLogDTO dto);

    /**
     * Delete a time entry.
     */
    void delete(Long id);

    // ---------------------------------------------------------
    // FETCH OPERATIONS
    // ---------------------------------------------------------

    /**
     * Get all time logs for a user (optionally filtered).
     */
    List<TimeLogDTO> getTimeLogs(
            Long userId,
            Long projectId,
            Long taskId,
            Long bugId,
            LocalDate fromDate,
            LocalDate toDate
    );

    /**
     * Get time logs for a specific day.
     */
    List<TimeLogDTO> getDailyLogs(Long userId, LocalDate date);

    /**
     * Get logs in a week (Mon–Sun).
     */
    List<TimeLogDTO> getWeeklyLogs(Long userId, LocalDate weekStartDate);

    /**
     * Get logs for a whole month.
     */
    List<TimeLogDTO> getMonthlyLogs(Long userId, int year, int month);

    /**
     * Get total time spent by user for a specific day.
     */
    Long getDailyTotalMinutes(Long userId, LocalDate date);

    /**
     * Get total time spent per day in a week.
     */
    Map<LocalDate, Long> getWeeklyBreakdown(Long userId, LocalDate weekStartDate);

    /**
     * Get total time spent per day in a month.
     */
    Map<LocalDate, Long> getMonthlyBreakdown(Long userId, int year, int month);

    /**
     * Total time spent on a project by a user.
     */
    Long getTotalTimeForProject(Long userId, Long projectId);

    /**
     * Total time spent on a task.
     */
    Long getTotalTimeForTask(Long userId, Long taskId);

    /**
     * Total time spent on a bug.
     */
    Long getTotalTimeForBug(Long userId, Long bugId);

    // ---------------------------------------------------------
    // COMPANY-LEVEL ANALYTICS
    // ---------------------------------------------------------

    /**
     * Total time logged by all users for a specific day.
     */
    Long getCompanyDailyTotal(LocalDate date);

    /**
     * Total time logged by all users for a week.
     */
    Long getCompanyWeeklyTotal(LocalDate weekStart);

    /**
     * Total time logged by all users in a month.
     */
    Long getCompanyMonthlyTotal(int year, int month);

    /**
     * Breakdown of total time per user for a day.
     */
    Map<Long, Long> getCompanyDailyBreakdown(LocalDate date);

    /**
     * Breakdown of time per project for a user.
     */
    Map<Long, Long> getUserProjectBreakdown(Long userId, LocalDate from, LocalDate to);

    /**
     * Breakdown of time per project (company level).
     */
    Map<Long, Long> getCompanyProjectBreakdown(LocalDate from, LocalDate to);

    // ---------------------------------------------------------
    // REPORTING UTILITIES
    // ---------------------------------------------------------

    /**
     * Get time summary for UI dashboard calendar view.
     */
    Map<LocalDate, Long> getCalendarSummary(Long userId, int year, int month);
}
