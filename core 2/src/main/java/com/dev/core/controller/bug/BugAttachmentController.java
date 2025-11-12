package com.dev.core.controller.bug;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.bug.BugAttachmentDTO;
import com.dev.core.service.bug.BugAttachmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/bugs/attachments")
@RequiredArgsConstructor
public class BugAttachmentController {

    private final BugAttachmentService attachmentService;
    private final ControllerHelper helper;

    @PostMapping("/bug/{bugId}")
    public ResponseEntity<?> upload(@PathVariable Long bugId,
                                    @RequestParam("file") MultipartFile file,
                                    @RequestParam(required = false) String description,
                                    @RequestParam(defaultValue = "INTERNAL") String visibility) {
        log.info("📎 Uploading attachment for bug [{}]", bugId);
        BugAttachmentDTO uploaded = attachmentService.uploadAttachment(bugId, file, description, visibility);
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
}
