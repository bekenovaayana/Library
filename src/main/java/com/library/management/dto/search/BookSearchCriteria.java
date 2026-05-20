package com.library.management.dto.search;

import com.library.management.entity.BookStatus;
import com.library.management.util.SearchUtils;

public record BookSearchCriteria(
        String title,
        String author,
        String category,
        String query,
        BookStatus status
) {

    public static BookSearchCriteria of(
            String title,
            String author,
            String category,
            String query,
            BookStatus status
    ) {
        return new BookSearchCriteria(
                SearchUtils.normalize(title),
                SearchUtils.normalize(author),
                SearchUtils.normalize(category),
                SearchUtils.normalize(query),
                status
        );
    }

    public static BookSearchCriteria empty() {
        return new BookSearchCriteria(null, null, null, null, null);
    }

    public boolean hasFilters() {
        return title != null || author != null || category != null || query != null || status != null;
    }
}
