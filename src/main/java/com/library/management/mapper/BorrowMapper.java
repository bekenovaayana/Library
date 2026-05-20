package com.library.management.mapper;

import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.BorrowRecordStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class BorrowMapper {

    public BorrowResponse toResponse(BorrowRecord record) {
        boolean overdue = record.getReturnDate() == null
                && record.getDueDate() != null
                && record.getDueDate().isBefore(LocalDateTime.now());

        return BorrowResponse.builder()
                .borrowId(record.getId())
                .bookId(record.getBook().getId())
                .username(record.getUser().getUsername())
                .bookTitle(record.getBook().getTitle())
                .coverUrl(record.getBook().getCoverUrl())
                .borrowDate(record.getBorrowDate())
                .dueDate(record.getDueDate())
                .returnDate(record.getReturnDate())
                .fineAmount(record.getFineAmount())
                .overdue(overdue)
                .status(resolveStatus(record))
                .build();
    }

    private BorrowRecordStatus resolveStatus(BorrowRecord record) {
        return record.getReturnDate() == null
                ? BorrowRecordStatus.ACTIVE
                : BorrowRecordStatus.RETURNED;
    }
}
