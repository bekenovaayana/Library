package com.library.management.exception;

public class BorrowNotFoundException extends ResourceNotFoundException {

    public BorrowNotFoundException(Long borrowId) {
        super("Borrow record not found with id: " + borrowId);
    }
}
