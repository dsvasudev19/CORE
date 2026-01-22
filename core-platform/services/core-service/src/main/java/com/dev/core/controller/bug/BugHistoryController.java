package com.dev.core.controller.bug;

import com.dev.core.api.ControllerHelper;
import com.dev.core.service.bug.BugHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/bugs/history")
@RequiredArgsConstructor
public class BugHistoryController {

    private final BugHistoryService bugHistoryService;
    private final ControllerHelper helper;

    @GetMapping("/bug/{bugId}")
    public ResponseEntity<?> getHistory(@PathVariable Long bugId) {
        log.info("🧾 Fetching history for bug [{}]", bugId);
        return helper.success("Bug history fetched", bugHistoryService.getHistoryByBug(bugId));
    }
}
