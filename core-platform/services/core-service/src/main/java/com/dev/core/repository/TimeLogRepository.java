package com.dev.core.repository;

import com.dev.core.domain.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long>, JpaSpecificationExecutor<TimeLog> {

    // ---------------------------------------------------------
    // ACTIVE TIMER
    // ---------------------------------------------------------

    Optional<TimeLog> findByUserIdAndActiveTrue(Long userId);


    // ---------------------------------------------------------
    // BASIC FETCHING
    // ---------------------------------------------------------

    List<TimeLog> findByUserId(Long userId);

    List<TimeLog> findByUserIdAndWorkDate(Long userId, LocalDate workDate);

    List<TimeLog> findByUserIdAndWorkDateBetween(Long userId, LocalDate fromDate, LocalDate toDate);


    // ---------------------------------------------------------
    // FILTERED BY PROJECT/TASK/BUG
    // ---------------------------------------------------------

    List<TimeLog> findByUserIdAndProject_Id(Long userId, Long projectId);

    List<TimeLog> findByUserIdAndTask_Id(Long userId, Long taskId);

    List<TimeLog> findByUserIdAndBug_Id(Long userId, Long bugId);


    // ---------------------------------------------------------
    // DAILY TOTAL
    // ---------------------------------------------------------

    @Query("""
        SELECT SUM(t.durationMinutes)
        FROM TimeLog t
        WHERE t.userId = :userId
          AND t.workDate = :day
    """)
    Long getDailyTotal(Long userId, LocalDate day);


    // ---------------------------------------------------------
    // WEEKLY BREAKDOWN
    // ---------------------------------------------------------

    @Query("""
        SELECT t.workDate AS day, SUM(t.durationMinutes) AS minutes
        FROM TimeLog t
        WHERE t.userId = :userId
          AND t.workDate BETWEEN :from AND :to
        GROUP BY t.workDate
        ORDER BY t.workDate
    """)
    List<Map<String, Object>> getWeeklyBreakdown(Long userId, LocalDate from, LocalDate to);


    // ---------------------------------------------------------
    // MONTHLY BREAKDOWN
    // ---------------------------------------------------------

    @Query("""
        SELECT t.workDate AS day, SUM(t.durationMinutes) AS minutes
        FROM TimeLog t
        WHERE t.userId = :userId
          AND YEAR(t.workDate) = :year
          AND MONTH(t.workDate) = :month
        GROUP BY t.workDate
        ORDER BY t.workDate
    """)
    List<Map<String, Object>> getMonthlyBreakdown(Long userId, int year, int month);


    // ---------------------------------------------------------
    // TOTAL TIME FOR PROJECT / TASK / BUG
    // ---------------------------------------------------------

    @Query("""
        SELECT SUM(t.durationMinutes)
        FROM TimeLog t
        WHERE t.userId = :userId
          AND t.project.id = :projectId
    """)
    Long getTotalForProject(Long userId, Long projectId);

    @Query("""
        SELECT SUM(t.durationMinutes)
        FROM TimeLog t
        WHERE t.userId = :userId
          AND t.task.id = :taskId
    """)
    Long getTotalForTask(Long userId, Long taskId);

    @Query("""
        SELECT SUM(t.durationMinutes)
        FROM TimeLog t
        WHERE t.userId = :userId
          AND t.bug.id = :bugId
    """)
    Long getTotalForBug(Long userId, Long bugId);


    // ---------------------------------------------------------
    // COMPANY-LEVEL TOTALS
    // ---------------------------------------------------------

    @Query("""
        SELECT SUM(t.durationMinutes)
        FROM TimeLog t
        WHERE t.organizationId = :orgId
          AND t.workDate = :day
    """)
    Long getCompanyDailyTotal(Long orgId, LocalDate day);

    @Query("""
        SELECT SUM(t.durationMinutes)
        FROM TimeLog t
        WHERE t.organizationId = :orgId
          AND t.workDate BETWEEN :from AND :to
    """)
    Long getCompanyRangeTotal(Long orgId, LocalDate from, LocalDate to);


    // ---------------------------------------------------------
    // COMPANY DAILY BREAKDOWN BY USER
    // ---------------------------------------------------------

    @Query("""
        SELECT t.userId AS userId, SUM(t.durationMinutes) AS minutes
        FROM TimeLog t
        WHERE t.organizationId = :orgId
          AND t.workDate = :day
        GROUP BY t.userId
    """)
    List<Map<String, Object>> getCompanyDailyBreakdown(Long orgId, LocalDate day);


    // ---------------------------------------------------------
    // PROJECT BREAKDOWN FOR USER
    // ---------------------------------------------------------

    @Query("""
        SELECT t.project.id AS projectId, SUM(t.durationMinutes) AS minutes
        FROM TimeLog t
        WHERE t.userId = :userId
          AND t.workDate BETWEEN :from AND :to
          AND t.project IS NOT NULL
        GROUP BY t.project.id
    """)
    List<Map<String, Object>> getUserProjectBreakdown(Long userId, LocalDate from, LocalDate to);


    // ---------------------------------------------------------
    // PROJECT BREAKDOWN FOR ORGANIZATION
    // ---------------------------------------------------------

    @Query("""
        SELECT t.project.id AS projectId, SUM(t.durationMinutes) AS minutes
        FROM TimeLog t
        WHERE t.organizationId = :orgId
          AND t.workDate BETWEEN :from AND :to
          AND t.project IS NOT NULL
        GROUP BY t.project.id
    """)
    List<Map<String, Object>> getCompanyProjectBreakdown(Long orgId, LocalDate from, LocalDate to);


    // ---------------------------------------------------------
    // ORGANIZATION OVERVIEW (ADMIN DASHBOARD)
    // ---------------------------------------------------------

    @Query("""
        SELECT t
        FROM TimeLog t
        WHERE t.organizationId = :orgId
          AND t.workDate BETWEEN :from AND :to
        ORDER BY t.workDate DESC, t.startTime DESC
    """)
    List<TimeLog> findByOrganizationIdAndDateRange(Long orgId, LocalDate from, LocalDate to);
}
