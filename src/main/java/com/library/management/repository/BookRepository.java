package com.library.management.repository;

import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    long countByStatus(BookStatus status);

    @Query("""
            SELECT b FROM Book b
            WHERE (:title = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')))
              AND (:author = '' OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%')))
              AND (:category = '' OR LOWER(b.category) LIKE LOWER(CONCAT('%', :category, '%')))
              AND (:status IS NULL OR b.status = :status)
            """)
    Page<Book> searchBooks(
            @Param("title") String title,
            @Param("author") String author,
            @Param("category") String category,
            @Param("status") BookStatus status,
            Pageable pageable
    );
}
