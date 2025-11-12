package com.dev.core.service.impl.bug;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.core.domain.Bug;
import com.dev.core.domain.BugHistory;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.bug.BugHistoryMapper;
import com.dev.core.model.bug.BugHistoryDTO;
import com.dev.core.repository.bug.BugHistoryRepository;
import com.dev.core.repository.bug.BugRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.bug.BugHistoryService;
import com.dev.core.service.validation.BugHistoryValidator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BugHistoryServiceImpl implements BugHistoryService {

    private final BugHistoryRepository bugHistoryRepository;
    private final BugRepository bugRepository;
    private final BugHistoryValidator bugHistoryValidator;
    private final AuthorizationService authorizationService;

    // 🔒 Authorization helper
    private void authorize(String action) {
        authorizationService.authorize("BUG_HISTORY", action);
    }

    // --------------------------------------------------------------
    // LOG HISTORY
    // --------------------------------------------------------------
    @Override
    public BugHistoryDTO logHistory(BugHistoryDTO dto) {
        authorize("CREATE");
        bugHistoryValidator.validateBeforeLog(dto);

        Bug bug = bugRepository.findById(dto.getBugId())
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{dto.getBugId()}));

        BugHistory entity = BugHistoryMapper.toEntity(dto);
        entity.setBug(bug);
        entity.setOrganizationId(bug.getOrganizationId());
        entity.setChangedAt(dto.getChangedAt() != null ? dto.getChangedAt() : LocalDateTime.now());
        entity.setActive(true);

        BugHistory saved = bugHistoryRepository.save(entity);

        log.info("🧾 Logged history for Bug [{}]: {} → {}", bug.getId(), dto.getOldValue(), dto.getNewValue());

        return BugHistoryMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // GET HISTORY BY BUG
    // --------------------------------------------------------------
    @Override
    public List<BugHistoryDTO> getHistoryByBug(Long bugId) {
        authorize("READ");

        if (!bugRepository.existsById(bugId))
            throw new BaseException("error.bug.not.found", new Object[]{bugId});

        List<BugHistory> entries = bugHistoryRepository.findByBug_IdOrderByChangedAtAsc(bugId);

        return entries.stream()
                .map(BugHistoryMapper::toDTO)
                .toList();
    }
}
