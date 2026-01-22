package com.dev.core.exception;

import com.dev.core.api.ApiResponse;
import com.dev.core.api.ControllerHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Locale;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ControllerHelper controllerHelper;

    /**
     * Handle validation/business rule violations.
     */
    @ExceptionHandler(ValidationFailedException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationFailed(ValidationFailedException ex, WebRequest request) {
        String message = resolveMessage(ex.getErrorCode(), ex.getParams(), request.getLocale(), ex.getMessage());
        log.warn("Validation failed: {} | Code: {}", message, ex.getErrorCode());

        return controllerHelper.error(
                message,
                HttpStatus.BAD_REQUEST,
                request.getDescription(false)
        );
    }

    /**
     * Handle all custom BaseExceptions.
     */
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiResponse<Object>> handleBaseException(BaseException ex, WebRequest request) {
        String message = resolveMessage(ex.getMessage(), null, request.getLocale(), ex.getMessage());
        log.error("BaseException: {}", message, ex);

        return controllerHelper.error(
                message,
                HttpStatus.BAD_REQUEST,
                request.getDescription(false)
        );
    }

    /**
     * Handle invalid argument errors.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        String message = resolveMessage(ex.getMessage(), null, request.getLocale(), "Invalid input provided");
        log.warn("IllegalArgumentException: {}", message);

        return controllerHelper.error(
                message,
                HttpStatus.BAD_REQUEST,
                request.getDescription(false)
        );
    }

    /**
     * Handle unexpected errors and runtime exceptions (generic fallback).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex, WebRequest request) {
        String message = resolveMessage("error.internal", null, request.getLocale(), "Internal server error");
        log.error("Unhandled Exception: {}", ex.getMessage(), ex);

        return controllerHelper.error(
                message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                request.getDescription(false)
        );
    }
    
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<Object> handleUnauthorized(UnauthorizedAccessException ex) {
        String message = messageSource.getMessage(
                ex.getErrorCode(),
                ex.getParams(),
                LocaleContextHolder.getLocale()
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", message,
                        "code", ex.getErrorCode()
                ));
    }


    /**
     * Safely resolve messages from the MessageSource.
     */
    private String resolveMessage(String key, Object[] args, Locale locale, String defaultMsg) {
        try {
            return messageSource.getMessage(key, args, defaultMsg, locale);
        } catch (Exception e) {
            log.debug("Message resolution failed for key: {}", key);
            return defaultMsg;
        }
    }
}
