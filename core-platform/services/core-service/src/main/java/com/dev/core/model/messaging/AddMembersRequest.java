package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Request to add members to a channel
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddMembersRequest {
    
    @NotEmpty(message = "User IDs are required")
    private List<String> userIds;
    
    private String role; // member, admin
}
