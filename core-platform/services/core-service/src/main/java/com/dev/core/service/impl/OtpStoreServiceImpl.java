package com.dev.core.service.impl;


import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.dev.core.service.OtpStore;

import java.util.Map;

@Service
public class OtpStoreServiceImpl implements OtpStore {

    private final Map<String, String> store = new ConcurrentHashMap<>();

    @Override
    public void saveOtp(String key, String otp, Long expirySeconds) {
        store.put(key, otp);  // ignoring expiry
    }

    @Override
    public String getOtp(String key) {
        return store.get(key);
    }

    @Override
    public void removeOtp(String key) {
        store.remove(key);
    }
}
