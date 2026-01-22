package com.dev.core.repository;

import com.dev.core.domain.CalendarEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long>, JpaSpecificationExecutor<CalendarEvent> {

    Optional<CalendarEvent> findByIdAndOrganizationId(Long id, Long organizationId);

    Page<CalendarEvent> findByOrganizationIdAndActiveTrue(Long organizationId, Pageable pageable);

    @Query("SELECT e FROM CalendarEvent e WHERE e.organizationId = :orgId AND e.active = true " +
           "AND e.startTime BETWEEN :startDate AND :endDate")
    List<CalendarEvent> findEventsBetweenDates(@Param("orgId") Long organizationId,
                                                @Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM CalendarEvent e WHERE e.organizationId = :orgId AND e.active = true " +
           "AND e.eventType = :type AND e.startTime BETWEEN :startDate AND :endDate")
    List<CalendarEvent> findEventsByTypeAndDateRange(@Param("orgId") Long organizationId,
                                                      @Param("type") String eventType,
                                                      @Param("startDate") LocalDateTime startDate,
                                                      @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM CalendarEvent e WHERE e.organizationId = :orgId AND e.active = true " +
           "AND e.createdByEmployee.id = :employeeId")
    List<CalendarEvent> findByCreatedByEmployee(@Param("orgId") Long organizationId,
                                                 @Param("employeeId") Long employeeId);

    @Query("SELECT e FROM CalendarEvent e WHERE e.organizationId = :orgId AND e.active = true " +
           "AND (LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<CalendarEvent> searchEvents(@Param("orgId") Long organizationId,
                                     @Param("keyword") String keyword,
                                     Pageable pageable);

    @Query("SELECT e FROM CalendarEvent e WHERE e.organizationId = :orgId AND e.active = true " +
           "AND e.status = :status")
    List<CalendarEvent> findByStatus(@Param("orgId") Long organizationId, @Param("status") String status);

    @Query("SELECT e FROM CalendarEvent e WHERE e.organizationId = :orgId AND e.active = true " +
           "AND e.isRecurring = true")
    List<CalendarEvent> findRecurringEvents(@Param("orgId") Long organizationId);

    Long countByOrganizationIdAndActiveTrueAndStatus(Long organizationId, String status);
}
