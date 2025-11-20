package com.dev.core.util;

import java.security.SecureRandom;

public class EmployeeCodeHelper {

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final String DEFAULT_DEPARTMENT = "Employee";

    private EmployeeCodeHelper() { }

    public static String generateEmployeeCode(String departmentName) {

        // Use default if null or blank
        String dept = (departmentName == null || departmentName.isBlank())
                ? DEFAULT_DEPARTMENT
                : departmentName.trim();

        // First letter of department (uppercase)
        char deptChar = Character.toUpperCase(dept.charAt(0));

        // Build: C + 4 digits + deptChar
        StringBuilder sb = new StringBuilder(6);

        sb.append('C'); // fixed company prefix

        // 4 digits
        for (int i = 0; i < 4; i++) {
            sb.append(secureRandom.nextInt(10));
        }

        sb.append(deptChar); // last character

        return sb.toString();
    }
}
