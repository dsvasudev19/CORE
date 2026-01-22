package com.dev.core.service;


public interface OtpStore {
    void saveOtp(String key, String otp, Long expirySeconds);
    String getOtp(String key);
    void removeOtp(String key);
}
