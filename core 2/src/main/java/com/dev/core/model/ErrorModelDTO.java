package com.dev.core.model;

import java.time.LocalDateTime;

public class ErrorModelDTO {
    private int code;
    private String message;
    private Object details;
    private LocalDateTime timestamp;

    public ErrorModelDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorModelDTO(int code, String message) {
        this.code = code;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorModelDTO(int code, String message, Object details) {
        this.code = code;
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Object getDetails() { return details; }
    public void setDetails(Object details) { this.details = details; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

