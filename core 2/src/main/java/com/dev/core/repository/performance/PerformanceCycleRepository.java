
package com.dev.core.repository.performance;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.performance.PerformanceCycle;

@Repository
public interface PerformanceCycleRepository extends JpaRepository<PerformanceCycle, Long> {

    Optional<PerformanceCycle> findByYearAndQuarterAndOrganizationId(
            Integer year,
            Integer quarter,
            Long organizationId
    );

    List<PerformanceCycle> findByOrganizationId(Long organizationId);

    List<PerformanceCycle> findByActiveTrueAndOrganizationId(Long organizationId);
}
