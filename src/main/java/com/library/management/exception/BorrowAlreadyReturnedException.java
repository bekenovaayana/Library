package com.library.management.exception;

public class BorrowAlreadyReturnedException extends RuntimeException {

    public BorrowAlreadyReturnedException(Long borrowId) {
        super("Borrow record with id " + borrowId + " has already been returned");
    }
}
