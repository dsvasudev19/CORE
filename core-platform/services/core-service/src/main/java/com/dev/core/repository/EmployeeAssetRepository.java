package com.dev.core.repository;

import com.dev.core.domain.EmployeeAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeAssetRepository extends JpaRepository<EmployeeAsset, Long> {
    List<EmployeeAsset> findByEmployee_Id(Long employeeId);
}

