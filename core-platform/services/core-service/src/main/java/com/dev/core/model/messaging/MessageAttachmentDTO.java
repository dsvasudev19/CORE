package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Message Attachment Data Transfer Object
 * Represents a file attached to a message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageAttachmentDTO {
    
    private Long id;
    
    private Long messageId;
    
    private String fileUrl;
    
    private String fileName;
    
    private String fileType;
    
    private Long fileSize;
    
    private String thumbnailUrl;
}
