package com.library.management.exception;

public class BookNotAvailableException extends RuntimeException {

    public BookNotAvailableException(Long bookId) {
        super("Book is not available for borrowing with id: " + bookId);
    }

    public BookNotAvailableException(String message) {
        super(message);
    }
}
