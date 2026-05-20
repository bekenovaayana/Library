package com.library.management.repository;

import com.library.management.entity.BookReservation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookReservationRepository extends JpaRepository<BookReservation, Long> {

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    @EntityGraph(attributePaths = {"book", "user"})
    List<BookReservation> findByUserIdOrderByCreatedAtAsc(Long userId);

    @EntityGraph(attributePaths = {"book", "user"})
    Optional<BookReservation> findByIdAndUserId(Long id, Long userId);

    @EntityGraph(attributePaths = {"book", "user"})
    @Query("""
            SELECT r FROM BookReservation r
            WHERE r.book.id = :bookId
            ORDER BY r.createdAt ASC
            """)
    List<BookReservation> findByBookIdOrderByCreatedAtAsc(@Param("bookId") Long bookId);

    long countByBookId(Long bookId);

    void deleteByUserIdAndBookId(Long userId, Long bookId);
}
