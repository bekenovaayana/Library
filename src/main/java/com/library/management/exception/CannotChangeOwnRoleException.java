package com.library.management.exception;

public class CannotChangeOwnRoleException extends RuntimeException {

    public CannotChangeOwnRoleException(String message) {
        super(message);
    }
}
