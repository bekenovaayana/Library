package com.library.management.notification;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LibraryEmailTemplatesTest {

    @Test
    void dueSoonBody_shouldEscapeHtmlAndIncludeLink() {
        String body = LibraryEmailTemplates.dueSoonBody(
                "user<script>",
                "Book & Co",
                "2026-01-01",
                "http://localhost:3000"
        );

        assertThat(body).contains("user&lt;script&gt;");
        assertThat(body).contains("Book &amp; Co");
        assertThat(body).contains("http://localhost:3000/my-books");
    }
}
