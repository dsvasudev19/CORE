package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Channel Member Data Transfer Object
 * Represents a user's membership in a channel
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelMemberDTO {
    
    private Long id;
    
    private Long channelId;
    
    private String userId;
    
    private String userName;
    
    private String userEmail;
    
    private String userAvatar;
    
    /**
     * Member role: owner, admin, member
     */
    private String role;
    
    private LocalDateTime joinedAt;
    
    private LocalDateTime lastReadAt;
}
