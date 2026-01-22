package com.dev.core.controller.bug;

import com.dev.core.api.ControllerHelper;
import com.dev.core.domain.BugAttachment;
import com.dev.core.model.bug.BugAttachmentDTO;
import com.dev.core.service.bug.BugAttachmentService;
import com.dev.core.repository.bug.BugAttachmentRepository;
import com.dev.core.security.SecurityContextUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/bugs/attachments")
@RequiredArgsConstructor
public class BugAttachmentController {

    private final BugAttachmentService attachmentService;
    private final BugAttachmentRepository attachmentRepository;
    private final ControllerHelper helper;
    private final SecurityContextUtil securityContextUtil;

    @PostMapping("/bug/{bugId}")
    public ResponseEntity<?> upload(@PathVariable Long bugId,
                                    @RequestParam("file") MultipartFile file,
                                    @RequestParam(defaultValue = "") String description
,
                                    @RequestParam(defaultValue = "INTERNAL") String visibility) {
        log.info("📎 Uploading attachment for bug [{}]", bugId);
        log.info("Checking description {}",description);
        String prependedDescription=securityContextUtil.getCurrentEmployee().getFirstName()+"("+securityContextUtil.getCurrentEmployee().getEmployeeCode()+")"+description;
        BugAttachmentDTO uploaded = attachmentService.uploadAttachment(bugId, file, prependedDescription, visibility);
        return helper.success("Attachment uploaded successfully", uploaded);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        log.info("🗑️ Deleting attachment [{}]", id);
        attachmentService.deleteAttachment(id);
        return helper.success("Attachment deleted successfully");
    }

    @GetMapping("/bug/{bugId}")
    public ResponseEntity<?> getAttachments(@PathVariable Long bugId) {
        log.info("📂 Fetching attachments for bug [{}]", bugId);
        return helper.success("Attachments fetched", attachmentService.getAttachmentsByBug(bugId));
    }

    // ------------------------------------------------------------------
    // ⭐ NEW: Download Attachment
    // ------------------------------------------------------------------
    @GetMapping("/download/{attachmentId}")
    public ResponseEntity<?> download(@PathVariable Long attachmentId) {
        log.info("📥 Downloading attachment [{}]", attachmentId);

        BugAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        byte[] fileBytes = attachmentService.getAttachmentFileBytes(attachmentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .contentLength(fileBytes.length)
                .body(fileBytes);
    }
}
