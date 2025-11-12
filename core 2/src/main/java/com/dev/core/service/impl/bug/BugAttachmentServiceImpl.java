package com.dev.core.service.impl.bug;

import com.dev.core.domain.Bug;
import com.dev.core.domain.BugAttachment;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.bug.BugAttachmentMapper;
import com.dev.core.model.bug.BugAttachmentDTO;
import com.dev.core.repository.bug.BugAttachmentRepository;
import com.dev.core.repository.bug.BugRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.bug.BugAttachmentService;
import com.dev.core.service.bug.BugAutomationService;
import com.dev.core.service.validation.BugAttachmentValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BugAttachmentServiceImpl implements BugAttachmentService {

    private final BugRepository bugRepository;
    private final BugAttachmentRepository attachmentRepository;
    private final BugAttachmentValidator attachmentValidator;
    private final AuthorizationService authorizationService;
    private final BugAutomationService bugAutomationService;

    @Value("${file.upload-dir:uploads}")
    private String uploadBasePath;

    // 🔒 Authorization helper
    private void authorize(String action) {
        authorizationService.authorize("BUG_ATTACHMENT", action);
    }

    // --------------------------------------------------------------
    // UPLOAD ATTACHMENT
    // --------------------------------------------------------------
    @Override
    public BugAttachmentDTO uploadAttachment(Long bugId, MultipartFile file, String description, String visibility) {
        authorize("CREATE");
        attachmentValidator.validateBeforeUpload(bugId, file);

        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));

        try {
            // Prepare directory
            Path uploadDir = Paths.get(uploadBasePath, "bugs", bugId.toString());
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Generate unique filename
            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : "";
            String uniqueName = UUID.randomUUID() + extension;

            Path targetPath = uploadDir.resolve(uniqueName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Create metadata entity
            BugAttachment entity = new BugAttachment();
            entity.setBug(bug);
            entity.setOrganizationId(bug.getOrganizationId());
            entity.setFileName(originalName);
            entity.setStoredPath(targetPath.toString());
            entity.setContentType(file.getContentType());
            entity.setFileSize(file.getSize());
            entity.setDescription(description);
            entity.setActive(true);
            try {
                entity.setVisibility(Enum.valueOf(com.dev.core.constants.FileVisibility.class,
                        visibility.toUpperCase()));
            } catch (IllegalArgumentException e) {
                entity.setVisibility(com.dev.core.constants.FileVisibility.INTERNAL);
            }

            BugAttachment saved = attachmentRepository.save(entity);

            bugAutomationService.onBugStatusChanged(bugId, null, "ATTACHMENT_ADDED");
            log.info("📎 Attachment [{}] uploaded for Bug [{}]", saved.getId(), bugId);

            return BugAttachmentMapper.toDTO(saved);

        } catch (IOException e) {
            log.error("❌ Failed to upload attachment for bug {}: {}", bugId, e.getMessage());
            throw new BaseException("error.file.upload.failed", new Object[]{file.getOriginalFilename()});
        }
    }

    // --------------------------------------------------------------
    // DELETE ATTACHMENT
    // --------------------------------------------------------------
    @Override
    public void deleteAttachment(Long id) {
        authorize("DELETE");

        BugAttachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.bug.attachment.not.found", new Object[]{id}));

        try {
            Path filePath = Paths.get(attachment.getStoredPath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("🗑️ Deleted attachment file from storage: {}", filePath);
            }
        } catch (IOException e) {
            log.warn("⚠️ Could not delete file from storage: {}", e.getMessage());
        }

        attachmentRepository.deleteById(id);
        bugAutomationService.onBugStatusChanged(attachment.getBug().getId(), null, "ATTACHMENT_DELETED");
    }

    // --------------------------------------------------------------
    // GET ATTACHMENTS FOR BUG
    // --------------------------------------------------------------
    @Override
    public List<BugAttachmentDTO> getAttachmentsByBug(Long bugId) {
        authorize("READ");

        List<BugAttachment> attachments = attachmentRepository.findByBug_Id(bugId);

        return attachments.stream()
                .map(BugAttachmentMapper::toDTO)
                .toList();
    }
}
