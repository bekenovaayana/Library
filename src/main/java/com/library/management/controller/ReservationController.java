package com.library.management.controller;

import com.library.management.config.OpenApiConfig;
import com.library.management.dto.response.ReservationResponse;
import com.library.management.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Reservations", description = "Reserve books that are currently borrowed")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/my")
    @Operation(summary = "My reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations() {
        return ResponseEntity.ok(reservationService.getMyReservations());
    }

    @PostMapping("/{bookId}")
    @Operation(summary = "Join waitlist for a borrowed book")
    public ResponseEntity<ReservationResponse> reserve(@PathVariable Long bookId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.reserveBook(bookId));
    }

    @DeleteMapping("/{bookId}")
    @Operation(summary = "Leave waitlist")
    public ResponseEntity<Void> cancel(@PathVariable Long bookId) {
        reservationService.cancelReservation(bookId);
        return ResponseEntity.noContent().build();
    }
}
