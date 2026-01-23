package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

/**
 * Request to mark messages as read
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkReadRequest {
    
    @NotNull(message = "Channel ID is required")
    private Long channelId;
    
    private Long lastMessageId;
}
