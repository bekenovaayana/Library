package com.library.management.service.impl;

import com.library.management.dto.response.ReservationResponse;
import com.library.management.entity.Book;
import com.library.management.entity.BookReservation;
import com.library.management.entity.BookStatus;
import com.library.management.entity.User;
import com.library.management.exception.BookNotAvailableException;
import com.library.management.exception.BookNotFoundException;
import com.library.management.exception.ReservationAlreadyExistsException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BookReservationRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.NotificationService;
import com.library.management.service.ReservationService;
import com.library.management.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final BookReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ReservationServiceImpl(
            BookReservationRepository reservationRepository,
            BookRepository bookRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public ReservationResponse reserveBook(Long bookId) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        if (book.getStatus() == BookStatus.AVAILABLE) {
            throw new BookNotAvailableException("Book is available — borrow it directly instead of reserving.");
        }

        if (reservationRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new ReservationAlreadyExistsException("You are already in the queue for this book.");
        }

        BookReservation saved = reservationRepository.save(BookReservation.builder()
                .user(user)
                .book(book)
                .build());

        int position = resolveQueuePosition(bookId, saved.getId());
        return toResponse(saved, position);
    }

    @Override
    @Transactional
    public void cancelReservation(Long bookId) {
        User user = getCurrentUser();
        reservationRepository.deleteByUserIdAndBookId(user.getId(), bookId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyReservations() {
        User user = getCurrentUser();
        return reservationRepository.findByUserIdOrderByCreatedAtAsc(user.getId()).stream()
                .map(reservation -> {
                    int position = resolveQueuePosition(reservation.getBook().getId(), reservation.getId());
                    return toResponse(reservation, position);
                })
                .toList();
    }

    @Override
    @Transactional
    public void notifyNextInQueue(Long bookId) {
        List<BookReservation> queue = reservationRepository.findByBookIdOrderByCreatedAtAsc(bookId);
        if (queue.isEmpty()) {
            return;
        }

        BookReservation next = queue.getFirst();
        if (!next.isNotified()) {
            notificationService.sendReservationAvailable(
                    next.getUser().getEmail(),
                    next.getUser().getUsername(),
                    next.getBook().getTitle()
            );
            next.setNotified(true);
            reservationRepository.save(next);
        }
    }

    private int resolveQueuePosition(Long bookId, Long reservationId) {
        List<BookReservation> queue = reservationRepository.findByBookIdOrderByCreatedAtAsc(bookId);
        for (int i = 0; i < queue.size(); i++) {
            if (queue.get(i).getId().equals(reservationId)) {
                return i + 1;
            }
        }
        return queue.size();
    }

    private ReservationResponse toResponse(BookReservation reservation, int position) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .bookId(reservation.getBook().getId())
                .bookTitle(reservation.getBook().getTitle())
                .coverUrl(reservation.getBook().getCoverUrl())
                .queuePosition(position)
                .createdAt(reservation.getCreatedAt())
                .build();
    }

    private User getCurrentUser() {
        String username = SecurityUtils.getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }
}
