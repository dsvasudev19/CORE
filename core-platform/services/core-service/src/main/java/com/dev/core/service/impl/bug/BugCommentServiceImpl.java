package com.dev.core.service.impl.bug;

import com.dev.core.constants.OperationType;
import com.dev.core.domain.Bug;
import com.dev.core.domain.BugComment;
import com.dev.core.domain.Employee;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.bug.BugCommentMapper;
import com.dev.core.model.bug.BugCommentDTO;
import com.dev.core.repository.bug.BugCommentRepository;
import com.dev.core.repository.bug.BugRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.BaseEntityAuditService;
import com.dev.core.service.bug.BugAutomationService;
import com.dev.core.service.bug.BugCommentService;
import com.dev.core.service.validation.BugCommentValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BugCommentServiceImpl implements BugCommentService {

    private final BugRepository bugRepository;
    private final BugCommentRepository commentRepository;
    private final BugCommentValidator commentValidator;
    private final BugAutomationService bugAutomationService;
    private final AuthorizationService authorizationService;
    private final BaseEntityAuditService baseAuditService;
    private final SecurityContextUtil securityContextUtil;

    // 🔒 Authorization helper
    private void authorize(String action) {
        authorizationService.authorize("BUG_COMMENT", action);
    }

    // --------------------------------------------------------------
    // ADD COMMENT
    // --------------------------------------------------------------
    @Override
    public BugCommentDTO addComment(Long bugId, BugCommentDTO dto) {
        authorize("CREATE");
        commentValidator.validateBeforeAdd(bugId, dto);

        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));

        BugComment entity = BugCommentMapper.toEntity(dto);
        entity.setBug(bug);
        entity.setCommentedAt(LocalDateTime.now());
        entity.setOrganizationId(bug.getOrganizationId());
        entity.setActive(true);
        
        baseAuditService.applyAudit(entity, OperationType.CREATE);
        Employee emp=new Employee();
        BeanUtils.copyProperties(securityContextUtil.getCurrentEmployee(), emp);
        entity.setCommentedBy(emp);
        entity.setCommentedAt(LocalDateTime.now());       
        BugComment saved = commentRepository.save(entity);

        // 🔔 Automation hook
        bugAutomationService.onBugStatusChanged(bugId, null, "COMMENT_ADDED");

        log.info("🗨️ Added comment [{}] on Bug ID: {}", saved.getId(), bugId);

        return BugCommentMapper.toDTO(saved, false);
    }

    // --------------------------------------------------------------
    // REPLY TO COMMENT
    // --------------------------------------------------------------
    @Override
    public BugCommentDTO replyToComment(Long parentCommentId, BugCommentDTO dto) {
        authorize("CREATE");
        commentValidator.validateBeforeReply(parentCommentId, dto);

        BugComment parent = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new BaseException("error.comment.not.found", new Object[]{parentCommentId}));

        BugComment reply = BugCommentMapper.toEntity(dto);
        reply.setParentComment(parent);
        reply.setBug(parent.getBug());
        reply.setOrganizationId(parent.getOrganizationId());
        reply.setActive(true);
        reply.setCommentedAt(LocalDateTime.now());

        baseAuditService.applyAudit(reply, OperationType.UPDATE);
        BugComment saved = commentRepository.save(reply);

        bugAutomationService.onBugStatusChanged(parent.getBug().getId(), null, "COMMENT_REPLY");

        log.info("💬 Added reply [{}] to Comment ID: {}", saved.getId(), parentCommentId);

        return BugCommentMapper.toDTO(saved, false);
    }

    // --------------------------------------------------------------
    // DELETE COMMENT
    // --------------------------------------------------------------
    @Override
    public void deleteComment(Long id) {
        authorize("DELETE");

        BugComment comment = commentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.comment.not.found", new Object[]{id}));

        baseAuditService.applyAudit(comment, OperationType.DELETE);
        commentRepository.delete(comment);
        log.info("🗑️ Deleted comment ID: {}", id);
    }

    // --------------------------------------------------------------
    // GET COMMENTS FOR BUG
    // --------------------------------------------------------------
    @Override
    @Transactional
    public List<BugCommentDTO> getCommentsByBug(Long bugId) {
        authorize("READ");

        List<BugComment> comments = commentRepository.findByBug_IdOrderByCommentedAtAsc(bugId);

        return comments.stream()
                .filter(c -> c.getParentComment() == null) // Only root-level
                .map(c -> BugCommentMapper.toDTO(c, true)) // Include replies recursively
                .toList();
    }
}
