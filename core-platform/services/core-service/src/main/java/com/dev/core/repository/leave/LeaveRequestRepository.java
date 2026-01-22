package com.dev.core.repository.leave;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dev.core.constants.LeaveStatus;
import com.dev.core.domain.leave.LeaveRequest;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    // --- Employee Queries ---
    List<LeaveRequest> findByEmployeeId(Long employeeId);

    List<LeaveRequest> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);

    List<LeaveRequest> findByEmployeeIdAndStartDateBetween(Long employeeId, LocalDate start, LocalDate end);

    // --- Manager Queries ---
    List<LeaveRequest> findByManagerIdAndStatus(Long managerId, LeaveStatus status);

    // --- Organization Queries ---
    List<LeaveRequest> findByOrganizationId(Long organizationId);
    
    List<LeaveRequest> findByOrganizationIdAndStatus(Long organizationId, LeaveStatus status);


    // --- Overlap Detection (critical for leave validation) ---
    List<LeaveRequest> findByEmployeeIdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long employeeId,
            List<LeaveStatus> statuses,
            LocalDate endDate,
            LocalDate startDate
    );

    // --- LeaveType specific queries ---
    List<LeaveRequest> findByLeaveTypeId(Long leaveTypeId);

    // --- Yearly Queries ---
    @Query("SELECT lr FROM LeaveRequest lr " +
    	       "WHERE lr.employee.id = :employeeId AND YEAR(lr.startDate) = :year")
    	List<LeaveRequest> findByEmployeeIdAndStartDateYear(
    	        Long employeeId,
    	        Integer year
    	);


    // --- Cancelled / Rejected cleanup ---
    List<LeaveRequest> findByEmployeeIdAndStatusIn(Long employeeId, List<LeaveStatus> statuses);
    
    long countByEmployeeIdAndStartDateBetween(Long employeeId, LocalDate start, LocalDate end);

    List<LeaveRequest> findByStatusAndCreatedAtBefore(LeaveStatus status, LocalDateTime cutoff);

}

