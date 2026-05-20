package com.library.management.service;

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
import com.library.management.exception.BorrowNotFoundException;
import com.library.management.mapper.BorrowMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.impl.BorrowServiceImpl;
import com.library.management.util.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

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
    private BorrowMapper borrowMapper;

    @InjectMocks
    private BorrowServiceImpl borrowService;

    @Test
    void borrowBook_whenBookAvailable_shouldCreateBorrowRecord() {
        // Arrange
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
                    .build();
            BorrowResponse expected = BorrowResponse.builder()
                    .borrowId(100L)
                    .username("john")
                    .bookTitle("Clean Code")
                    .status(BorrowRecordStatus.ACTIVE)
                    .build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(borrowRecordRepository.existsByBookIdAndReturnDateIsNull(10L)).thenReturn(false);
            when(borrowRecordRepository.save(any(BorrowRecord.class))).thenReturn(savedRecord);
            when(borrowMapper.toResponse(savedRecord)).thenReturn(expected);

            // Act
            BorrowResponse result = borrowService.borrowBook(request);

            // Assert
            assertThat(result.getBorrowId()).isEqualTo(100L);
            assertThat(result.getStatus()).isEqualTo(BorrowRecordStatus.ACTIVE);
            assertThat(book.getStatus()).isEqualTo(BookStatus.BORROWED);
            verify(borrowRecordRepository).save(any(BorrowRecord.class));
        }
    }

    @Test
    void borrowBook_whenBookNotAvailable_shouldThrowException() {
        // Arrange
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            Book book = Book.builder().id(10L).status(BookStatus.BORROWED).build();
            BorrowRequest request = BorrowRequest.builder().bookId(10L).build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));

            // Act & Assert
            assertThatThrownBy(() -> borrowService.borrowBook(request))
                    .isInstanceOf(BookNotAvailableException.class);
        }
    }

    @Test
    void borrowBook_whenBookNotFound_shouldThrowException() {
        // Arrange
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            BorrowRequest request = BorrowRequest.builder().bookId(99L).build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(bookRepository.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> borrowService.borrowBook(request))
                    .isInstanceOf(BookNotFoundException.class);
        }
    }

    @Test
    void returnBook_whenActiveBorrowExists_shouldReturnBook() {
        // Arrange
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            Book book = Book.builder().id(10L).title("Clean Code").status(BookStatus.BORROWED).build();
            BorrowRecord record = BorrowRecord.builder()
                    .id(100L)
                    .user(user)
                    .book(book)
                    .borrowDate(LocalDateTime.now().minusDays(1))
                    .build();
            BorrowResponse expected = BorrowResponse.builder()
                    .borrowId(100L)
                    .status(BorrowRecordStatus.RETURNED)
                    .build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(borrowRecordRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(record));
            when(borrowMapper.toResponse(record)).thenReturn(expected);

            // Act
            BorrowResponse result = borrowService.returnBook(100L);

            // Assert
            assertThat(result.getStatus()).isEqualTo(BorrowRecordStatus.RETURNED);
            assertThat(record.getReturnDate()).isNotNull();
            assertThat(book.getStatus()).isEqualTo(BookStatus.AVAILABLE);
        }
    }

    @Test
    void returnBook_whenAlreadyReturned_shouldThrowException() {
        // Arrange
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();
            Book book = Book.builder().id(10L).status(BookStatus.AVAILABLE).build();
            BorrowRecord record = BorrowRecord.builder()
                    .id(100L)
                    .user(user)
                    .book(book)
                    .borrowDate(LocalDateTime.now().minusDays(2))
                    .returnDate(LocalDateTime.now().minusDays(1))
                    .build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(borrowRecordRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(record));

            // Act & Assert
            assertThatThrownBy(() -> borrowService.returnBook(100L))
                    .isInstanceOf(BorrowAlreadyReturnedException.class);
        }
    }

    @Test
    void returnBook_whenBorrowNotFound_shouldThrowException() {
        // Arrange
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUsername).thenReturn("john");

            User user = User.builder().id(1L).username("john").build();

            when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
            when(borrowRecordRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> borrowService.returnBook(999L))
                    .isInstanceOf(BorrowNotFoundException.class);
        }
    }
}
