package com.dev.core.repository.leave;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.leave.LeaveBalance;


@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeIdAndYear(Long employeeId, Long leaveTypeId, Integer year);

    List<LeaveBalance> findByEmployeeIdAndYear(Long employeeId, Integer year);

    List<LeaveBalance> findByLeaveTypeIdAndYear(Long leaveTypeId, Integer year);

    List<LeaveBalance> findByOrganizationIdAndYear(Long organizationId, Integer year);

    boolean existsByEmployeeIdAndLeaveTypeIdAndYear(Long employeeId, Long leaveTypeId, Integer year);
}
