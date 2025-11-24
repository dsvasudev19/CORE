package com.dev.core.service.bug;

import com.dev.core.model.bug.BugAttachmentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BugAttachmentService {

    BugAttachmentDTO uploadAttachment(Long bugId, MultipartFile file, String description, String visibility);

    void deleteAttachment(Long id);

    List<BugAttachmentDTO> getAttachmentsByBug(Long bugId);

	byte[] getAttachmentFileBytes(Long attachmentId);
}
