package com.library.management.exception;

public class BookNotFoundException extends ResourceNotFoundException {

    public BookNotFoundException(Long id) {
        super("Book not found with id: " + id);
    }
}
