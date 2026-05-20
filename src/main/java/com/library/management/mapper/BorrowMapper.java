package com.library.management.mapper;

import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.BorrowRecordStatus;
import org.springframework.stereotype.Component;

@Component
public class BorrowMapper {

    public BorrowResponse toResponse(BorrowRecord record) {
        return BorrowResponse.builder()
                .borrowId(record.getId())
                .username(record.getUser().getUsername())
                .bookTitle(record.getBook().getTitle())
                .borrowDate(record.getBorrowDate())
                .returnDate(record.getReturnDate())
                .status(resolveStatus(record))
                .build();
    }

    private BorrowRecordStatus resolveStatus(BorrowRecord record) {
        return record.getReturnDate() == null
                ? BorrowRecordStatus.ACTIVE
                : BorrowRecordStatus.RETURNED;
    }
}
