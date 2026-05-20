package com.library.management.mapper;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookBorrowInfoResponse;
import com.library.management.dto.response.BookDetailResponse;
import com.library.management.dto.response.BookResponse;
import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.entity.BorrowRecord;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .category(book.getCategory())
                .status(book.getStatus())
                .coverUrl(book.getCoverUrl())
                .createdBy(book.getCreatedBy())
                .build();
    }

    public BookDetailResponse toDetailResponse(
            Book book,
            BorrowRecord activeBorrow,
            long reservationQueueSize,
            boolean userHasReservation
    ) {
        BookBorrowInfoResponse borrowInfo = null;

        if (activeBorrow != null) {
            borrowInfo = BookBorrowInfoResponse.builder()
                    .borrowId(activeBorrow.getId())
                    .username(activeBorrow.getUser().getUsername())
                    .borrowDate(activeBorrow.getBorrowDate())
                    .build();
        }

        return BookDetailResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .category(book.getCategory())
                .status(book.getStatus())
                .coverUrl(book.getCoverUrl())
                .currentBorrow(borrowInfo)
                .reservationQueueSize(reservationQueueSize)
                .userHasReservation(userHasReservation)
                .build();
    }

    public Book toEntity(BookRequest request) {
        return Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .coverUrl(request.getCoverUrl())
                .status(BookStatus.AVAILABLE)
                .build();
    }

    public void updateEntity(Book book, BookRequest request) {
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setCoverUrl(request.getCoverUrl());
    }
}
