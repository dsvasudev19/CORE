package com.dev.core.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * Request to add a reaction to a message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddReactionRequest {
    
    @NotBlank(message = "Emoji is required")
    private String emoji;
}
