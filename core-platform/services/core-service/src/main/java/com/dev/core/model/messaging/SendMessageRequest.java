package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Request to send a new message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    
    @NotNull(message = "Channel ID is required")
    private Long channelId;
    
    @NotBlank(message = "Message content is required")
    private String content;
    
    private String messageType; // text, image, file, system
    
    /**
     * Parent message ID for threaded replies
     */
    private Long parentMessageId;
    
    /**
     * User IDs mentioned in the message
     */
    private List<String> mentions;
    
    /**
     * File attachments
     */
    private List<MessageAttachmentDTO> attachments;
}
