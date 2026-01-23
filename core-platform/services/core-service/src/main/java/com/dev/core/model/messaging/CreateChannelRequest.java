package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Request to create a new channel
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateChannelRequest {
    
    @NotBlank(message = "Channel name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Channel type is required")
    private String type; // public, private, direct
    
    /**
     * Team ID - optional for organization-wide channels
     * Required for team-specific channels
     */
    private Long teamId;
    
    /**
     * List of user IDs to add as members
     */
    private List<String> memberIds;
}
