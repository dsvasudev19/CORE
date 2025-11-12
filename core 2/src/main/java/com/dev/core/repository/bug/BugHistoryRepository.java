package com.dev.core.repository.bug;

import com.dev.core.domain.BugHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugHistoryRepository extends JpaRepository<BugHistory, Long>, JpaSpecificationExecutor<BugHistory> {

    List<BugHistory> findByBug_IdOrderByChangedAtAsc(Long bugId);
}
