package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request to update channel details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateChannelRequest {
    
    private String name;
    
    private String description;
}
