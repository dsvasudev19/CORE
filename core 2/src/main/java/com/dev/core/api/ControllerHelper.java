package com.dev.core.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ControllerHelper {

    // ✅ Success (with data)
    public <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        ApiResponse<T> response = ApiResponse.success(message, data);
        return ResponseEntity.ok(response);
    }

    // ✅ Success (no data)
    public <T> ResponseEntity<ApiResponse<T>> success(String message) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    // ⚠️ Error (standard)
    public ResponseEntity<ApiResponse<Object>> error(String message, HttpStatus status, String path) {
        ApiError error = ApiError.of(message, status, null);
        ApiResponse<Object> response = ApiResponse.error(message, error);
        return ResponseEntity.status(status).body(response);
    }
    

    // ⚠️ Error (with details)
    public ResponseEntity<ApiResponse<Object>> error(String message, HttpStatus status, String path, Map<String, Object> details) {
        ApiError error = ApiError.of(message, status, details);
        ApiResponse<Object> response = ApiResponse.error(message, error);
        return ResponseEntity.status(status).body(response);
    }
}
