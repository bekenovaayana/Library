package com.library.management.service;

import com.library.management.dto.response.ReservationResponse;

import java.util.List;

public interface ReservationService {

    ReservationResponse reserveBook(Long bookId);

    void cancelReservation(Long bookId);

    List<ReservationResponse> getMyReservations();

    void notifyNextInQueue(Long bookId);
}
