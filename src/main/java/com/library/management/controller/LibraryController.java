package com.library.management.controller;

import com.library.management.config.LibraryProperties;
import com.library.management.config.OpenApiConfig;
import com.library.management.dto.response.LibraryPolicyResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/library")
@Tag(name = "Library", description = "Library lending policy")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class LibraryController {

    private final LibraryProperties libraryProperties;

    public LibraryController(LibraryProperties libraryProperties) {
        this.libraryProperties = libraryProperties;
    }

    @GetMapping("/policy")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lending policy", description = "Loan period and late fee rates")
    public ResponseEntity<LibraryPolicyResponse> getPolicy() {
        return ResponseEntity.ok(LibraryPolicyResponse.builder()
                .borrowDays(libraryProperties.getBorrowDays())
                .finePerDay(libraryProperties.getFinePerDay())
                .maxFine(libraryProperties.getMaxFine())
                .build());
    }
}
