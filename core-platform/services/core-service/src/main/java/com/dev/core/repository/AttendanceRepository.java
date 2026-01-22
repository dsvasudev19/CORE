package com.dev.core.repository;

import com.dev.core.domain.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long>, JpaSpecificationExecutor<Attendance> {

    Optional<Attendance> findByIdAndOrganizationId(Long id, Long organizationId);

    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate date);

    Page<Attendance> findByOrganizationIdAndAttendanceDate(Long organizationId, LocalDate date, Pageable pageable);

    Page<Attendance> findByOrganizationIdAndAttendanceDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    List<Attendance> findByEmployeeIdAndAttendanceDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.organizationId = :orgId AND a.attendanceDate = :date AND a.status = :status")
    Long countByOrganizationIdAndDateAndStatus(@Param("orgId") Long organizationId, 
                                                @Param("date") LocalDate date, 
                                                @Param("status") String status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.organizationId = :orgId AND a.attendanceDate = :date AND a.isLate = true")
    Long countLateArrivals(@Param("orgId") Long organizationId, @Param("date") LocalDate date);

    @Query("SELECT AVG(a.workHours) FROM Attendance a WHERE a.organizationId = :orgId AND a.attendanceDate BETWEEN :startDate AND :endDate")
    Double getAverageWorkHours(@Param("orgId") Long organizationId, 
                               @Param("startDate") LocalDate startDate, 
                               @Param("endDate") LocalDate endDate);
}
