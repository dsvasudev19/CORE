package com.dev.core.repository.bug;

import com.dev.core.domain.Bug;
import com.dev.core.constants.BugStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long>, JpaSpecificationExecutor<Bug> {

    List<Bug> findByOrganizationId(Long organizationId);

    List<Bug> findByProject_Id(Long projectId);

    // 🔥 Updated: assignedTo is now Employee, so query by its id
    List<Bug> findByAssignedTo_Id(Long userId);

    // Optional: If you ever want to fetch by reporting employee
    List<Bug> findByReportedBy_Id(Long userId);

    List<Bug> findByStatus(BugStatus status);

    List<Bug> findByDueDateBeforeAndStatusNot(LocalDateTime date, BugStatus status);
}
