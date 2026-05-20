package com.library.management.controller;

import com.library.management.config.OpenApiConfig;
import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookDetailResponse;
import com.library.management.dto.response.BookResponse;
import com.library.management.dto.search.BookSearchCriteria;
import com.library.management.entity.BookStatus;
import com.library.management.service.BookService;
import com.library.management.web.BookSortFields;
import com.library.management.web.PageableSupport;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
@Tag(name = "Books", description = "Book catalog management and search")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Get all books", description = "Returns paginated list of all books")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Books retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Page<BookResponse>> getAllBooks(
            @PageableDefault(size = 10, sort = "title", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        PageableSupport.validate(pageable, BookSortFields.ALLOWED);
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Search books", description = "Search by title, author, and/or category with partial case-insensitive match")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Page<BookResponse>> searchBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BookStatus status,
            @PageableDefault(size = 10, sort = "title", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        PageableSupport.validate(pageable, BookSortFields.ALLOWED);
        BookSearchCriteria criteria = BookSearchCriteria.of(title, author, category, q, status);
        return ResponseEntity.ok(bookService.searchBooks(criteria, pageable));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "List book categories", description = "Distinct categories for autocomplete")
    public ResponseEntity<List<String>> getCategories(@RequestParam(required = false) String prefix) {
        return ResponseEntity.ok(bookService.getCategories(prefix));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Get book by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book found"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public ResponseEntity<BookDetailResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create book", description = "Admin only - creates a book with AVAILABLE status")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Book created"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookRequest request) {
        BookResponse response = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update book", description = "Admin only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book updated"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request
    ) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete book", description = "Admin only - cannot delete borrowed books")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Book deleted"),
            @ApiResponse(responseCode = "404", description = "Book not found"),
            @ApiResponse(responseCode = "409", description = "Book is currently borrowed")
    })
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
