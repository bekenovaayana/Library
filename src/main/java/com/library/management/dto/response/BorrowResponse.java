package com.library.management.dto.response;

import com.library.management.entity.BorrowRecordStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowResponse {

    private Long borrowId;
    private Long bookId;
    private String username;
    private String bookTitle;
    private String coverUrl;
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private BigDecimal fineAmount;
    private boolean overdue;
    private BorrowRecordStatus status;
}
