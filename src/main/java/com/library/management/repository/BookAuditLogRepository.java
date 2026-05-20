package com.library.management.repository;

import com.library.management.entity.BookAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookAuditLogRepository extends JpaRepository<BookAuditLog, Long> {

    Page<BookAuditLog> findAllByOrderByPerformedAtDesc(Pageable pageable);
}
