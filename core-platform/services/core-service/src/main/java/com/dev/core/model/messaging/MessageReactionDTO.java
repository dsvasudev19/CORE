package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Message Reaction Data Transfer Object
 * Represents an emoji reaction to a message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageReactionDTO {
    
    private Long id;
    
    private Long messageId;
    
    private String userId;
    
    private String userName;
    
    private String emoji;
    
    private LocalDateTime createdAt;
}
