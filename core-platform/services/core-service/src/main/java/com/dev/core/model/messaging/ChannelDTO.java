package com.dev.core.model.messaging;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Channel Data Transfer Object
 * Represents a messaging channel (public, private, or direct)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelDTO {
    
    private Long id;
    
    private String name;
    
    private String description;
    
    /**
     * Channel type: public, private, direct
     */
    private String type;
    
    private Long teamId;
    
    private Long organizationId;
    
    private String createdBy;
    
    @JsonProperty("isArchived")
    private Boolean isArchived;
    
    private LocalDateTime lastMessageAt;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    /**
     * Channel members with their roles
     */
    private List<ChannelMemberDTO> members;
    
    /**
     * Unread message counts per user
     * Map of userId -> unread count
     */
    private Map<String, Integer> unreadCounts;
    
    /**
     * Last message preview (optional)
     */
    private MessageDTO lastMessage;
    
    /**
     * Unread count for current user
     */
    private Integer unreadCount;
}
