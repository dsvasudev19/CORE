package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response containing list of channels
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelsResponse {
    
    private List<ChannelDTO> channels;
    
    private Integer total;
}
