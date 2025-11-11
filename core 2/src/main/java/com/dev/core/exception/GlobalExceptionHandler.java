package com.dev.core.exception;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.dev.core.api.ApiResponse;

import lombok.extern.slf4j.Slf4j;

import java.util.Locale;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @Autowired
    private MessageSource messageSource;

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        String message = messageSource.getMessage(ex.getMessage(), null, ex.getMessage(), request.getLocale());
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex, WebRequest request) {
        String message = messageSource.getMessage("error.internal", null, "Internal server error", request.getLocale());
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(ValidationFailedException.class)
    public ResponseEntity<ApiResponse> handleValidationFailed(ValidationFailedException ex) {
        log.warn("Validation failed: {}", ex.getMessage());
        ApiResponse response = ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .build();
        return ResponseEntity.badRequest().body(response);
    }
}

