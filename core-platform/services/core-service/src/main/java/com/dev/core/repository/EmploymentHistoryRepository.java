package com.dev.core.repository;

import com.dev.core.domain.EmploymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploymentHistoryRepository extends JpaRepository<EmploymentHistory, Long>, JpaSpecificationExecutor<EmploymentHistory> {

    List<EmploymentHistory> findByEmployee_Id(Long employeeId);
}
