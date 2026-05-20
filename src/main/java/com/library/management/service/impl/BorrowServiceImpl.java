package com.library.management.service.impl;

import com.library.management.config.LibraryProperties;
import com.library.management.dto.request.BorrowRequest;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.User;
import com.library.management.exception.BookNotAvailableException;
import com.library.management.exception.BookNotFoundException;
import com.library.management.exception.BorrowAlreadyReturnedException;
import com.library.management.exception.BorrowLimitExceededException;
import com.library.management.exception.BorrowNotFoundException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.mapper.BorrowMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BookReservationRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.BorrowService;
import com.library.management.service.ReservationService;
import com.library.management.util.FineCalculator;
import com.library.management.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookReservationRepository reservationRepository;
    private final BorrowMapper borrowMapper;
    private final LibraryProperties libraryProperties;
    private final ReservationService reservationService;

    public BorrowServiceImpl(
            BorrowRecordRepository borrowRecordRepository,
            BookRepository bookRepository,
            UserRepository userRepository,
            BookReservationRepository reservationRepository,
            BorrowMapper borrowMapper,
            LibraryProperties libraryProperties,
            ReservationService reservationService
    ) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
        this.borrowMapper = borrowMapper;
        this.libraryProperties = libraryProperties;
        this.reservationService = reservationService;
    }

    @Override
    @Transactional
    public BorrowResponse borrowBook(BorrowRequest request) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new BookNotFoundException(request.getBookId()));

        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new BookNotAvailableException(book.getId());
        }

        if (borrowRecordRepository.existsByBookIdAndReturnDateIsNull(book.getId())) {
            throw new BookNotAvailableException(book.getId());
        }

        long activeBorrows = borrowRecordRepository.countByUserIdAndReturnDateIsNull(user.getId());
        if (activeBorrows >= libraryProperties.getMaxBooksPerUser()) {
            throw new BorrowLimitExceededException(
                    "Borrow limit reached. Maximum " + libraryProperties.getMaxBooksPerUser() + " books at a time."
            );
        }

        LocalDateTime now = LocalDateTime.now();
        book.setStatus(BookStatus.BORROWED);

        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .book(book)
                .borrowDate(now)
                .dueDate(now.plusDays(libraryProperties.getBorrowDays()))
                .fineAmount(BigDecimal.ZERO)
                .reminderSent(false)
                .build();

        reservationRepository.deleteByUserIdAndBookId(user.getId(), book.getId());

        BorrowRecord savedRecord = borrowRecordRepository.save(record);
        return borrowMapper.toResponse(savedRecord);
    }

    @Override
    @Transactional
    public BorrowResponse returnBook(Long borrowId) {
        User user = getCurrentUser();

        BorrowRecord record = borrowRecordRepository.findByIdAndUserId(borrowId, user.getId())
                .orElseThrow(() -> new BorrowNotFoundException(borrowId));

        if (record.getReturnDate() != null) {
            throw new BorrowAlreadyReturnedException(borrowId);
        }

        LocalDateTime now = LocalDateTime.now();
        record.setReturnDate(now);
        record.setFineAmount(FineCalculator.calculate(record.getDueDate(), now, libraryProperties));
        record.getBook().setStatus(BookStatus.AVAILABLE);

        reservationService.notifyNextInQueue(record.getBook().getId());

        return borrowMapper.toResponse(record);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BorrowResponse> getMyBorrows(Pageable pageable) {
        User user = getCurrentUser();
        return borrowRecordRepository.findByUserUsername(user.getUsername(), pageable)
                .map(borrowMapper::toResponse);
    }

    private User getCurrentUser() {
        String username = SecurityUtils.getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }
}
