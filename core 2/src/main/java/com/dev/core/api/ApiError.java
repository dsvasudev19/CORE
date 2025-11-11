package com.dev.core.api;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ApiError {

    private String message;             // human-readable message
    private HttpStatus status;          // HTTP status
    private String path;                // endpoint URL
    private Map<String, Object> details; // optional details (validation, etc.)
    private LocalDateTime timestamp;

    public static ApiError of(String message, HttpStatus status, String path, Map<String, Object> details) {
        return ApiError.builder()
                .message(message)
                .status(status)
                .path(path)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
