package com.library.management.dto.response;

import com.library.management.entity.BookStatus;
import lombok.AllArgsConstructor;
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
    private BookBorrowInfoResponse currentBorrow;
}
