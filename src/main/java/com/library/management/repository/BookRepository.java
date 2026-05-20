package com.library.management.repository;

import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    long countByStatus(BookStatus status);

    @Query("""
            SELECT b FROM Book b
            WHERE LOWER(b.title) LIKE :titlePattern
              AND LOWER(b.author) LIKE :authorPattern
              AND LOWER(b.category) LIKE :categoryPattern
              AND (LOWER(b.title) LIKE :queryPattern
                   OR LOWER(b.author) LIKE :queryPattern
                   OR LOWER(b.category) LIKE :queryPattern)
              AND (:status IS NULL OR b.status = :status)
            """)
    Page<Book> searchBooks(
            @Param("titlePattern") String titlePattern,
            @Param("authorPattern") String authorPattern,
            @Param("categoryPattern") String categoryPattern,
            @Param("queryPattern") String queryPattern,
            @Param("status") BookStatus status,
            Pageable pageable
    );

    @Query("""
            SELECT DISTINCT b.category FROM Book b
            WHERE LOWER(b.category) LIKE :prefixPattern
            ORDER BY b.category ASC
            """)
    List<String> findDistinctCategories(@Param("prefixPattern") String prefixPattern);
}
