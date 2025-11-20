package com.dev.core.controller;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.TimeLogDTO;
import com.dev.core.service.TimeLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timelogs")
@RequiredArgsConstructor
@Slf4j
public class TimeLogController {

    private final TimeLogService timeLogService;
    private final ControllerHelper helper;

    // ---------------------------------------------------------
    // TIMER OPERATIONS
    // ---------------------------------------------------------

    @PostMapping("/start")
    public ResponseEntity<?> startTimer(@RequestParam Long userId,
                                        @RequestParam(required = false) Long taskId,
                                        @RequestParam(required = false) Long bugId,
                                        @RequestParam(required = false) String note) {

        return helper.success("Timer started",
                timeLogService.startTimer(userId, taskId, bugId, note));
    }

    @PostMapping("/stop")
    public ResponseEntity<?> stopTimer(@RequestParam Long userId) {
        return helper.success("Timer stopped", timeLogService.stopTimer(userId));
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveTimer(@RequestParam Long userId) {
        return helper.success("Active timer fetched", timeLogService.getActiveTimer(userId));
    }

    // ---------------------------------------------------------
    // MANUAL ENTRY
    // ---------------------------------------------------------

    @PostMapping
    public ResponseEntity<?> createManual(@RequestBody TimeLogDTO dto) {
        return helper.success("Manual time entry created",
                timeLogService.createManualEntry(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateManual(@PathVariable Long id,
                                          @RequestBody TimeLogDTO dto) {
        return helper.success("Manual time entry updated",
                timeLogService.updateManualEntry(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManual(@PathVariable Long id) {
        timeLogService.delete(id);
        return helper.success("Time entry deleted");
    }

    // ---------------------------------------------------------
    // FETCH LOGS
    // ---------------------------------------------------------

    @GetMapping
    public ResponseEntity<?> getTimeLogs(
            @RequestParam Long userId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long taskId,
            @RequestParam(required = false) Long bugId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        List<TimeLogDTO> logs = timeLogService.getTimeLogs(
                userId, projectId, taskId, bugId, fromDate, toDate
        );

        return helper.success("Time logs fetched", logs);
    }

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyLogs(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return helper.success("Daily logs fetched",
                timeLogService.getDailyLogs(userId, date));
    }

    @GetMapping("/weekly")
    public ResponseEntity<?> getWeeklyLogs(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart
    ) {
        return helper.success("Weekly logs fetched",
                timeLogService.getWeeklyLogs(userId, weekStart));
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyLogs(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return helper.success("Monthly logs fetched",
                timeLogService.getMonthlyLogs(userId, year, month));
    }

    // ---------------------------------------------------------
    // TOTALS
    // ---------------------------------------------------------

    @GetMapping("/daily/total")
    public ResponseEntity<?> getDailyTotal(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return helper.success("Daily total fetched",
                timeLogService.getDailyTotalMinutes(userId, date));
    }

    @GetMapping("/weekly/breakdown")
    public ResponseEntity<?> getWeeklyBreakdown(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart
    ) {
        return helper.success("Weekly breakdown fetched",
                timeLogService.getWeeklyBreakdown(userId, weekStart));
    }

    @GetMapping("/monthly/breakdown")
    public ResponseEntity<?> getMonthlyBreakdown(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return helper.success("Monthly breakdown fetched",
                timeLogService.getMonthlyBreakdown(userId, year, month));
    }

    @GetMapping("/project/total")
    public ResponseEntity<?> getProjectTotal(
            @RequestParam Long userId,
            @RequestParam Long projectId
    ) {
        return helper.success("Project total time fetched",
                timeLogService.getTotalTimeForProject(userId, projectId));
    }

    @GetMapping("/task/total")
    public ResponseEntity<?> getTaskTotal(
            @RequestParam Long userId,
            @RequestParam Long taskId
    ) {
        return helper.success("Task total time fetched",
                timeLogService.getTotalTimeForTask(userId, taskId));
    }

    @GetMapping("/bug/total")
    public ResponseEntity<?> getBugTotal(
            @RequestParam Long userId,
            @RequestParam Long bugId
    ) {
        return helper.success("Bug total time fetched",
                timeLogService.getTotalTimeForBug(userId, bugId));
    }

    // ---------------------------------------------------------
    // COMPANY ANALYTICS
    // ---------------------------------------------------------

    @GetMapping("/company/daily-total")
    public ResponseEntity<?> getCompanyDailyTotal(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return helper.success("Company daily total fetched",
                timeLogService.getCompanyDailyTotal(date));
    }

    @GetMapping("/company/weekly-total")
    public ResponseEntity<?> getCompanyWeeklyTotal(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart
    ) {
        return helper.success("Company weekly total fetched",
                timeLogService.getCompanyWeeklyTotal(weekStart));
    }

    @GetMapping("/company/monthly-total")
    public ResponseEntity<?> getCompanyMonthlyTotal(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return helper.success("Company monthly total fetched",
                timeLogService.getCompanyMonthlyTotal(year, month));
    }

    @GetMapping("/company/daily-breakdown")
    public ResponseEntity<?> getCompanyDailyBreakdown(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return helper.success("Company daily breakdown fetched",
                timeLogService.getCompanyDailyBreakdown(date));
    }

    @GetMapping("/user/project-breakdown")
    public ResponseEntity<?> getUserProjectBreakdown(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return helper.success("User project breakdown fetched",
                timeLogService.getUserProjectBreakdown(userId, fromDate, toDate));
    }

    @GetMapping("/company/project-breakdown")
    public ResponseEntity<?> getCompanyProjectBreakdown(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return helper.success("Company project breakdown fetched",
                timeLogService.getCompanyProjectBreakdown(fromDate, toDate));
    }

    // ---------------------------------------------------------
    // CALENDAR SUMMARY
    // ---------------------------------------------------------

    @GetMapping("/calendar")
    public ResponseEntity<?> getCalendarSummary(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return helper.success("Calendar summary fetched",
                timeLogService.getCalendarSummary(userId, year, month));
    }
}
