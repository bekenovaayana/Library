package com.library.management.dto.response;

import com.library.management.entity.BookStatus;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDetailResponse {

    private Long id;
    private String title;
    private String author;
    private String category;
    private BookStatus status;
    private String coverUrl;
    private BookBorrowInfoResponse currentBorrow;
    private long reservationQueueSize;
    private boolean userHasReservation;

    /** Loan period in days (library policy). */
    private int borrowDays;

    /** Late fee per overdue day. */
    private BigDecimal finePerDay;

    /** Maximum late fee per loan. */
    private BigDecimal maxFine;

    /** Expected return date if borrowed now (available books only). */
    private LocalDateTime estimatedDueDate;
}
