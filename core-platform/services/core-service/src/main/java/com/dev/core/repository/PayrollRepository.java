package com.dev.core.repository;

import com.dev.core.domain.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    List<Payroll> findByOrganizationIdAndIsActiveTrue(Long organizationId);

    List<Payroll> findByEmployeeIdAndIsActiveTrue(Long employeeId);

    List<Payroll> findByOrganizationIdAndMonthAndYear(Long organizationId, Integer month, Integer year);

    Optional<Payroll> findByEmployeeIdAndMonthAndYearAndIsActiveTrue(Long employeeId, Integer month, Integer year);

    List<Payroll> findByOrganizationIdAndStatus(Long organizationId, String status);

    List<Payroll> findByOrganizationIdAndEffectiveDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT p FROM Payroll p WHERE p.organizationId = :organizationId " +
           "AND p.month = :month AND p.year = :year AND p.isActive = true")
    List<Payroll> findByOrganizationAndPeriod(@Param("organizationId") Long organizationId,
                                               @Param("month") Integer month,
                                               @Param("year") Integer year);

    @Query("SELECT COUNT(p) FROM Payroll p WHERE p.organizationId = :organizationId " +
           "AND p.status = :status AND p.isActive = true")
    Long countByOrganizationAndStatus(@Param("organizationId") Long organizationId,
                                       @Param("status") String status);

    @Query("SELECT p FROM Payroll p WHERE p.employee.id = :employeeId " +
           "AND p.isActive = true ORDER BY p.year DESC, p.month DESC")
    List<Payroll> findEmployeePayrollHistory(@Param("employeeId") Long employeeId);

    @Query("SELECT p FROM Payroll p WHERE p.organizationId = :organizationId " +
           "AND p.status IN :statuses AND p.isActive = true")
    List<Payroll> findByOrganizationAndStatuses(@Param("organizationId") Long organizationId,
                                                  @Param("statuses") List<String> statuses);
}
