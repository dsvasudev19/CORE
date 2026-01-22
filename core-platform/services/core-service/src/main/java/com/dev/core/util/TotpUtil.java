package com.dev.core.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

public class TotpUtil {

    private static final SecureRandom random = new SecureRandom();

    public static String generateSecret() {
        byte[] buffer = new byte[20]; // 160-bit secret
        random.nextBytes(buffer);
        return Base64.getEncoder().encodeToString(buffer);
    }

    public static boolean verifyTotp(String secret, String code) {
        try {
            long timeIndex = System.currentTimeMillis() / 30000; // 30 sec window
            for (int i = -1; i <= 1; i++) { // allow slight drift
                String expected = generateTotp(secret, timeIndex + i);
                if (expected.equals(code)) return true;
            }
        } catch (Exception ignored) {}
        return false;
    }

    public static String generateTotp(String secret, long timeIndex) throws Exception {
        byte[] secretBytes = Base64.getDecoder().decode(secret);
        byte[] timeBytes = ByteBuffer.allocate(8).putLong(timeIndex).array();

        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(new SecretKeySpec(secretBytes, "HmacSHA1"));
        byte[] hash = mac.doFinal(timeBytes);

        int offset = hash[hash.length - 1] & 0xF;
        int binary =
                ((hash[offset] & 0x7F) << 24)
                        | ((hash[offset + 1] & 0xFF) << 16)
                        | ((hash[offset + 2] & 0xFF) << 8)
                        | (hash[offset + 3] & 0xFF);

        int otp = binary % 1000000;

        return String.format("%06d", otp);
    }
}
