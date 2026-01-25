package com.dev.core.service.bug;

import com.dev.core.model.bug.BugDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BugService {

    BugDTO createBug(BugDTO dto);

    BugDTO updateBug(Long id, BugDTO dto);

    void deleteBug(Long id);

    BugDTO getBugById(Long id, boolean includeDetails);

    Page<BugDTO> searchBugs(Long organizationId, String keyword, Pageable pageable);

    List<BugDTO> getBugsByProject(Long projectId);

    List<BugDTO> getBugsByAssignee(Long userId);
    
    List<BugDTO> getMyBugs(Long organizationId);

    BugDTO changeBugStatus(Long bugId, String newStatus);

    BugDTO changeBugSeverity(Long bugId, String newSeverity);

    void reopenBug(Long bugId);

    void verifyBug(Long bugId, Long verifiedBy);

    void closeBug(Long bugId);

    void escalateBug(Long bugId, String reason);

    void linkBugToTask(Long bugId, Long taskId);

    void unlinkBugFromTask(Long bugId);
}
