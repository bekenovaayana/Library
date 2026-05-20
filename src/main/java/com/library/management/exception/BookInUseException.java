package com.library.management.exception;

public class BookInUseException extends RuntimeException {

    public BookInUseException(Long id) {
        super("Book with id " + id + " cannot be deleted because it is currently borrowed");
    }
}
