package com.library.management.service;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookDetailResponse;
import com.library.management.dto.response.BookResponse;
import com.library.management.dto.search.BookSearchCriteria;
import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.exception.BookInUseException;
import com.library.management.exception.BookNotFoundException;
import com.library.management.config.LibraryProperties;
import com.library.management.mapper.BookMapper;
import com.library.management.repository.BookAuditLogRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BookReservationRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.impl.BookServiceImpl;
import com.library.management.util.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceImplTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private BorrowRecordRepository borrowRecordRepository;

    @Mock
    private BookReservationRepository reservationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookMapper bookMapper;

    @Mock
    private BookAuditLogRepository bookAuditLogRepository;

    @Mock
    private LibraryProperties libraryProperties;

    @InjectMocks
    private BookServiceImpl bookService;

    @Test
    void createBook_whenValidRequest_shouldReturnBookResponse() {
        BookRequest request = BookRequest.builder()
                .title("Clean Code")
                .author("Robert Martin")
                .category("Programming")
                .build();

        Book book = Book.builder()
                .id(1L)
                .title("Clean Code")
                .author("Robert Martin")
                .category("Programming")
                .status(BookStatus.AVAILABLE)
                .build();

        BookResponse expected = BookResponse.builder()
                .id(1L)
                .title("Clean Code")
                .author("Robert Martin")
                .category("Programming")
                .status(BookStatus.AVAILABLE)
                .build();

        when(bookMapper.toEntity(request)).thenReturn(book);
        when(bookRepository.save(book)).thenReturn(book);
        when(bookMapper.toResponse(book)).thenReturn(expected);

        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUsername).thenReturn("admin");
            BookResponse result = bookService.createBook(request);
            assertThat(result.getTitle()).isEqualTo("Clean Code");
            assertThat(result.getStatus()).isEqualTo(BookStatus.AVAILABLE);
            verify(bookAuditLogRepository).save(any());
        }
    }

    @Test
    void getBookById_whenBookExists_shouldReturnBookDetailResponse() {
        Book book = Book.builder().id(1L).title("Clean Code").status(BookStatus.AVAILABLE).build();
        BookDetailResponse expected = BookDetailResponse.builder().id(1L).title("Clean Code").build();

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(borrowRecordRepository.findByBookIdAndReturnDateIsNull(1L)).thenReturn(Optional.empty());
        when(reservationRepository.countByBookId(1L)).thenReturn(0L);
        when(bookMapper.toDetailResponse(book, null, 0L, false)).thenReturn(expected);

        BookDetailResponse result = bookService.getBookById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Clean Code");
    }

    @Test
    void getBookById_whenBookNotFound_shouldThrowException() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.getBookById(99L))
                .isInstanceOf(BookNotFoundException.class);
    }

    @Test
    void searchBooks_whenCriteriaProvided_shouldReturnPage() {
        BookSearchCriteria criteria = BookSearchCriteria.of("java", null, null, null, null);
        Pageable pageable = PageRequest.of(0, 10);
        Book book = Book.builder().id(1L).title("Java Basics").build();
        BookResponse response = BookResponse.builder().id(1L).title("Java Basics").build();
        Page<Book> bookPage = new PageImpl<>(List.of(book));

        when(bookRepository.searchBooks(eq("%java%"), eq("%"), eq("%"), eq("%"), eq(null), eq(pageable)))
                .thenReturn(bookPage);
        when(bookMapper.toResponse(book)).thenReturn(response);

        Page<BookResponse> result = bookService.searchBooks(criteria, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getTitle()).isEqualTo("Java Basics");
    }

    @Test
    void deleteBook_whenBookIsBorrowed_shouldThrowException() {
        Book book = Book.builder().id(1L).status(BookStatus.BORROWED).build();
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        assertThatThrownBy(() -> bookService.deleteBook(1L))
                .isInstanceOf(BookInUseException.class);
    }

    @Test
    void deleteBook_whenBookIsAvailable_shouldDelete() {
        Book book = Book.builder().id(1L).status(BookStatus.AVAILABLE).build();
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUsername).thenReturn("admin");
            bookService.deleteBook(1L);
            verify(bookAuditLogRepository).save(any());
            verify(bookRepository).delete(book);
        }
    }

    @Test
    void updateBook_whenBookExists_shouldUpdateAndReturnResponse() {
        BookRequest request = BookRequest.builder()
                .title("Updated Title")
                .author("Updated Author")
                .category("Science")
                .build();

        Book book = Book.builder().id(1L).title("Old").status(BookStatus.AVAILABLE).build();
        BookResponse expected = BookResponse.builder().id(1L).title("Updated Title").build();

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(bookMapper.toResponse(book)).thenReturn(expected);

        BookResponse result = bookService.updateBook(1L, request);

        verify(bookMapper).updateEntity(book, request);
        assertThat(result.getTitle()).isEqualTo("Updated Title");
    }
}
