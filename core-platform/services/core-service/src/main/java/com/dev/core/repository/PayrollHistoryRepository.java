package com.dev.core.repository;

import com.dev.core.domain.PayrollHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollHistoryRepository extends JpaRepository<PayrollHistory, Long> {

    List<PayrollHistory> findByPayrollIdOrderByActionDateDesc(Long payrollId);

    List<PayrollHistory> findByEmployeeIdOrderByActionDateDesc(Long employeeId);

    List<PayrollHistory> findByOrganizationIdOrderByActionDateDesc(Long organizationId);
}
