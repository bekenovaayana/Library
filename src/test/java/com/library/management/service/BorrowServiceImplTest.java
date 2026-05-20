package com.library.management.service;

import com.library.management.config.LibraryProperties;
import com.library.management.dto.request.BorrowRequest;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.BorrowRecordStatus;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.exception.BookNotAvailableException;
import com.library.management.exception.BookNotFoundException;
import com.library.management.exception.BorrowAlreadyReturnedException;
import com.library.management.exception.BorrowLimitExceededException;
import com.library.management.exception.BorrowNotFoundException;
import com.library.management.mapper.BorrowMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BookReservationRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.impl.BorrowServiceImpl;
import com.library.management.util.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BorrowServiceImplTest {

    @Mock
    private BorrowRecordRepository borrowRecordRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookReservationRepository reservationRepository;

    @Mock
    private BorrowMapper borrowMapper;

    @Mock
    private ReservationService reservationService;

    @InjectMocks
    private BorrowServiceImpl borrowService;

    private LibraryProperties libraryProperties;

    @BeforeEach
    void setUp() {
        libraryProperties = new LibraryProperties();
        libraryProperties.setMaxBooksPerUser(5);
        libraryProperties.setBorrowDays(14);
        borrowService = new BorrowServiceImpl(
                borrowRecordRepository,
                bookRepository,
                userRepository,
                reservationRepository,
                borrowMapper,
                libraryProperties,
                reservationService
        );
    }

    @Test
    void borrowBook_whenBookAvailable_shouldCreateBorrowRecord() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").role(Role.USER).build();
            Book book = Book.builder().id(10L).title("Clean Code").status(BookStatus.AVAILABLE).build();
            BorrowRequest request = BorrowRequest.builder().bookId(10L).build();
            BorrowRecord savedRecord = BorrowRecord.builder()
                    .id(100L)
                    .user(user)
                    .book(book)
                    .borrowDate(LocalDateTime.now())
                    .dueDate(LocalDateTime.now().plusDays(14))
                    .fineAmount(BigDecimal.ZERO)
                    .build();
            BorrowResponse expected = BorrowResponse.builder()
                    .borrowId(100L)
                    .username("john")
                    .bookTitle("Clean Code")
                    .status(BorrowRecordStatus.ACTIVE)
                    .build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(borrowRecordRepository.countByUserIdAndReturnDateIsNull(1L)).thenReturn(0L);
            when(borrowRecordRepository.existsByBookIdAndReturnDateIsNull(10L)).thenReturn(false);
            when(borrowRecordRepository.save(any(BorrowRecord.class))).thenReturn(savedRecord);
            when(borrowMapper.toResponse(savedRecord)).thenReturn(expected);

            BorrowResponse result = borrowService.borrowBook(request);

            assertThat(result.getBorrowId()).isEqualTo(100L);
            assertThat(book.getStatus()).isEqualTo(BookStatus.BORROWED);
            verify(reservationRepository).deleteByUserIdAndBookId(1L, 10L);
        }
    }

    @Test
    void borrowBook_whenLimitReached_shouldThrowException() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            Book book = Book.builder().id(10L).status(BookStatus.AVAILABLE).build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(borrowRecordRepository.countByUserIdAndReturnDateIsNull(1L)).thenReturn(5L);

            assertThatThrownBy(() -> borrowService.borrowBook(BorrowRequest.builder().bookId(10L).build()))
                    .isInstanceOf(BorrowLimitExceededException.class);
        }
    }

    @Test
    void borrowBook_whenBookNotAvailable_shouldThrowException() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            Book book = Book.builder().id(10L).status(BookStatus.BORROWED).build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));

            assertThatThrownBy(() -> borrowService.borrowBook(BorrowRequest.builder().bookId(10L).build()))
                    .isInstanceOf(BookNotAvailableException.class);
        }
    }

    @Test
    void returnBook_whenActiveBorrowExists_shouldReturnBook() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            Book book = Book.builder().id(10L).title("Clean Code").status(BookStatus.BORROWED).build();
            BorrowRecord record = BorrowRecord.builder()
                    .id(100L)
                    .user(user)
                    .book(book)
                    .borrowDate(LocalDateTime.now().minusDays(1))
                    .dueDate(LocalDateTime.now().plusDays(13))
                    .fineAmount(BigDecimal.ZERO)
                    .build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(borrowRecordRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(record));
            when(borrowMapper.toResponse(record)).thenReturn(
                    BorrowResponse.builder().borrowId(100L).status(BorrowRecordStatus.RETURNED).build()
            );

            BorrowResponse result = borrowService.returnBook(100L);

            assertThat(result.getStatus()).isEqualTo(BorrowRecordStatus.RETURNED);
            assertThat(record.getReturnDate()).isNotNull();
            assertThat(book.getStatus()).isEqualTo(BookStatus.AVAILABLE);
            verify(reservationService).notifyNextInQueue(10L);
        }
    }

    @Test
    void returnBook_whenAlreadyReturned_shouldThrowException() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            Book book = Book.builder().id(10L).status(BookStatus.AVAILABLE).build();
            BorrowRecord record = BorrowRecord.builder()
                    .id(100L)
                    .user(user)
                    .book(book)
                    .borrowDate(LocalDateTime.now().minusDays(2))
                    .dueDate(LocalDateTime.now().minusDays(1))
                    .returnDate(LocalDateTime.now().minusDays(1))
                    .build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(borrowRecordRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(record));

            assertThatThrownBy(() -> borrowService.returnBook(100L))
                    .isInstanceOf(BorrowAlreadyReturnedException.class);
        }
    }

    @Test
    void borrowBook_whenBookNotFound_shouldThrowException() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(bookRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> borrowService.borrowBook(BorrowRequest.builder().bookId(99L).build()))
                    .isInstanceOf(BookNotFoundException.class);
        }
    }
}
