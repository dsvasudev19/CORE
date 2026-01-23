package com.dev.core.model.messaging;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Message Data Transfer Object
 * Represents a chat message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    
    private Long id;
    
    private Long channelId;
    
    private String senderId;
    
    private String senderName;
    
    private String senderAvatar;
    
    private String content;
    
    /**
     * Message type: text, image, file, system
     */
    private String messageType;
    
    /**
     * Parent message ID for threaded replies
     */
    private Long parentMessageId;
    
    /**
     * Thread ID for grouping replies
     */
    private Long threadId;
    
    /**
     * Number of replies in thread
     */
    private Integer replyCount;
    
    @JsonProperty("isEdited")
    private Boolean isEdited;
    
    @JsonProperty("isDeleted")
    private Boolean isDeleted;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    /**
     * File attachments
     */
    private List<MessageAttachmentDTO> attachments;
    
    /**
     * User mentions (@username)
     */
    private List<String> mentions;
    
    /**
     * Emoji reactions
     */
    private List<MessageReactionDTO> reactions;
}
