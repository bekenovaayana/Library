package com.library.management.util;

import java.util.Locale;

public final class SearchUtils {

    private SearchUtils() {
    }

    public static String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    /** Lowercase LIKE pattern; "%" matches all rows (avoids LOWER() on bind params in PostgreSQL). */
    public static String likePattern(String value) {
        if (value == null || value.isBlank()) {
            return "%";
        }
        return "%" + value.trim().toLowerCase(Locale.ROOT) + "%";
    }

    /** Prefix pattern for autocomplete (e.g. "prog" → "prog%"). */
    public static String prefixPattern(String value) {
        if (value == null || value.isBlank()) {
            return "%";
        }
        return value.trim().toLowerCase(Locale.ROOT) + "%";
    }
}
