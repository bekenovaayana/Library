package com.library.management.web;

import com.library.management.exception.InvalidPageableException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

public final class PageableSupport {

    public static final int MAX_PAGE_SIZE = 100;

    private PageableSupport() {
    }

    public static void validate(Pageable pageable, Set<String> allowedSortProperties) {
        if (pageable.getPageSize() < 1) {
            throw new InvalidPageableException("Page size must be at least 1");
        }
        if (pageable.getPageSize() > MAX_PAGE_SIZE) {
            throw new InvalidPageableException("Page size must not exceed " + MAX_PAGE_SIZE);
        }
        if (pageable.getPageNumber() < 0) {
            throw new InvalidPageableException("Page index must not be negative");
        }

        for (Sort.Order order : pageable.getSort()) {
            String property = order.getProperty();
            if (!allowedSortProperties.contains(property)) {
                throw new InvalidPageableException("Invalid sort property: " + property);
            }
        }
    }
}
