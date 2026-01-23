package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response containing paginated messages
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagesResponse {
    
    private List<MessageDTO> messages;
    
    private Boolean hasMore;
    
    private Long nextCursor;
    
    private Integer total;
}
