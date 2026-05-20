package com.library.management.web;

import java.util.Set;

public final class BookSortFields {

    public static final Set<String> ALLOWED = Set.of("id", "title", "author", "category", "status");

    private BookSortFields() {
    }
}
