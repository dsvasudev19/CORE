package com.dev.core.util;


import java.security.SecureRandom;

public class PasswordGenerator {

    private static final SecureRandom secureRandom = new SecureRandom();

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";

    // Safe special characters (no spaces)
    private static final String SPECIAL = "!@#$%&*()=+<>?/{}[]";

    // Combined pool
    private static final String ALL = UPPER + LOWER + DIGITS + SPECIAL;

    // Default length
    private static final int DEFAULT_LENGTH = 12;

    private PasswordGenerator() { }

    public static String generatePassword() {
        return generatePassword(DEFAULT_LENGTH);
    }

    public static String generatePassword(int length) {

        if (length < 8) {
            throw new IllegalArgumentException("Password length must be at least 8 characters");
        }

        StringBuilder password = new StringBuilder(length);

        // Ensure at least one char from each category
        password.append(randomChar(UPPER));
        password.append(randomChar(LOWER));
        password.append(randomChar(DIGITS));
        password.append(randomChar(SPECIAL));

        // Fill the remaining characters
        for (int i = password.length(); i < length; i++) {
            password.append(randomChar(ALL));
        }

        // Shuffle the characters (so first 4 aren't predictable)
        return shuffleString(password.toString());
    }

    private static char randomChar(String pool) {
        return pool.charAt(secureRandom.nextInt(pool.length()));
    }

    private static String shuffleString(String str) {
        char[] array = str.toCharArray();
        for (int i = array.length - 1; i > 0; i--) {
            int j = secureRandom.nextInt(i + 1);
            char temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return new String(array);
    }
}
