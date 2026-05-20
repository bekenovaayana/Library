package com.library.management.repository;

import com.library.management.entity.BorrowRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    @EntityGraph(attributePaths = {"book", "user"})
    Optional<BorrowRecord> findByIdAndUserId(Long id, Long userId);

    @EntityGraph(attributePaths = {"book", "user"})
    List<BorrowRecord> findByUserUsernameOrderByBorrowDateDesc(String username);

    boolean existsByBookIdAndReturnDateIsNull(Long bookId);

    @EntityGraph(attributePaths = {"book", "user"})
    Optional<BorrowRecord> findByBookIdAndReturnDateIsNull(Long bookId);

    @EntityGraph(attributePaths = {"book", "user"})
    @Query("SELECT br FROM BorrowRecord br")
    Page<BorrowRecord> findAllWithDetails(Pageable pageable);

    @EntityGraph(attributePaths = {"book", "user"})
    @Query("""
            SELECT br FROM BorrowRecord br
            JOIN br.user u
            JOIN br.book b
            WHERE (:search = ''
                   OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:activeOnly IS NULL
                   OR (:activeOnly = TRUE AND br.returnDate IS NULL)
                   OR (:activeOnly = FALSE AND br.returnDate IS NOT NULL))
            """)
    Page<BorrowRecord> findAllFiltered(
            @Param("search") String search,
            @Param("activeOnly") Boolean activeOnly,
            Pageable pageable
    );
}
