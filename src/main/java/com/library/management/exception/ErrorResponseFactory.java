package com.library.management.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class ErrorResponseFactory {

    public ErrorResponse create(HttpStatus status, String message, HttpServletRequest request) {
        return create(status, message, request.getRequestURI(), null);
    }

    public ErrorResponse create(
            HttpStatus status,
            String message,
            String path,
            List<FieldViolation> errors
    ) {
        return ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .errors(errors)
                .build();
    }

    public ErrorResponse validationFailed(HttpServletRequest request, List<FieldViolation> errors) {
        return create(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                request.getRequestURI(),
                errors
        );
    }
}
