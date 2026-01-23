package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * Request to search messages
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchMessagesRequest {
    
    @NotBlank(message = "Search query is required")
    private String query;
    
    private Long channelId;
    
    private Integer limit;
}
