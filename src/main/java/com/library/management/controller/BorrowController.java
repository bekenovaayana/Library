package com.library.management.controller;

import com.library.management.config.OpenApiConfig;
import com.library.management.dto.request.BorrowRequest;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.service.BorrowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "Borrowing", description = "Borrow and return books")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping("/borrow")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Borrow a book", description = "Borrows an available book for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Book borrowed successfully"),
            @ApiResponse(responseCode = "404", description = "Book not found"),
            @ApiResponse(responseCode = "409", description = "Book not available")
    })
    public ResponseEntity<BorrowResponse> borrowBook(@Valid @RequestBody BorrowRequest request) {
        BorrowResponse response = borrowService.borrowBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/return/{borrowId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Return a book", description = "Returns a previously borrowed book")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book returned successfully"),
            @ApiResponse(responseCode = "404", description = "Borrow record not found"),
            @ApiResponse(responseCode = "409", description = "Book already returned")
    })
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long borrowId) {
        BorrowResponse response = borrowService.returnBook(borrowId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/borrow/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get my borrows", description = "Returns all borrow records for the authenticated user")
    @ApiResponse(responseCode = "200", description = "Borrow records retrieved")
    public ResponseEntity<List<BorrowResponse>> getMyBorrows() {
        return ResponseEntity.ok(borrowService.getMyBorrows());
    }
}
