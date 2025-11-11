package com.dev.core.util;


import java.text.Normalizer;

public class SlugUtil {
    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        // Normalize (decompose accented characters, e.g. é -> e)
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);

        // Remove accents and diacritics
        String slug = normalized.replaceAll("\\p{M}", "");

        // Remove non-alphanumeric characters except spaces
        slug = slug.replaceAll("[^a-zA-Z0-9\\s]", "");

        // Replace multiple spaces with single dash
        slug = slug.trim().replaceAll("\\s+", "-");

        return slug.toLowerCase();
    }
}

