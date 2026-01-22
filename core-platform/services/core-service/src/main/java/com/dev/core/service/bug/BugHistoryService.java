package com.dev.core.service.bug;

import com.dev.core.model.bug.BugHistoryDTO;

import java.util.List;

public interface BugHistoryService {

    BugHistoryDTO logHistory(BugHistoryDTO dto);

    List<BugHistoryDTO> getHistoryByBug(Long bugId);
}
