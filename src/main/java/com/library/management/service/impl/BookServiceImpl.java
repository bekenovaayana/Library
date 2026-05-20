package com.library.management.service.impl;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookDetailResponse;
import com.library.management.dto.response.BookResponse;
import com.library.management.dto.search.BookSearchCriteria;
import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.User;
import com.library.management.exception.BookInUseException;
import com.library.management.exception.BookNotFoundException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.mapper.BookMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BookReservationRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.BookService;
import com.library.management.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final BookReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookMapper bookMapper;

    public BookServiceImpl(
            BookRepository bookRepository,
            BorrowRecordRepository borrowRecordRepository,
            BookReservationRepository reservationRepository,
            UserRepository userRepository,
            BookMapper bookMapper
    ) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.bookMapper = bookMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookResponse> getAllBooks(Pageable pageable) {
        return searchBooks(BookSearchCriteria.empty(), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookResponse> searchBooks(BookSearchCriteria criteria, Pageable pageable) {
        return bookRepository.searchBooks(
                blankToEmpty(criteria.title()),
                blankToEmpty(criteria.author()),
                blankToEmpty(criteria.category()),
                blankToEmpty(criteria.query()),
                criteria.status(),
                pageable
        ).map(bookMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getCategories(String prefix) {
        String normalized = prefix == null || prefix.isBlank() ? "" : prefix.trim().toLowerCase();
        return bookRepository.findDistinctCategories(normalized);
    }

    private static String blankToEmpty(String value) {
        return value == null || value.isBlank() ? "" : value;
    }

    @Override
    @Transactional(readOnly = true)
    public BookDetailResponse getBookById(Long id) {
        Book book = findBookOrThrow(id);
        BorrowRecord activeBorrow = borrowRecordRepository
                .findByBookIdAndReturnDateIsNull(id)
                .orElse(null);

        long queueSize = reservationRepository.countByBookId(id);
        boolean userHasReservation = resolveUserHasReservation(id);

        return bookMapper.toDetailResponse(book, activeBorrow, queueSize, userHasReservation);
    }

    private boolean resolveUserHasReservation(Long bookId) {
        try {
            String username = SecurityUtils.getCurrentUsername();
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return false;
            }
            return reservationRepository.existsByUserIdAndBookId(user.getId(), bookId);
        } catch (IllegalStateException ex) {
            return false;
        }
    }

    @Override
    @Transactional
    public BookResponse createBook(BookRequest request) {
        Book book = bookMapper.toEntity(request);
        Book savedBook = bookRepository.save(book);
        return bookMapper.toResponse(savedBook);
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = findBookOrThrow(id);
        bookMapper.updateEntity(book, request);
        return bookMapper.toResponse(book);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = findBookOrThrow(id);

        if (book.getStatus() == BookStatus.BORROWED) {
            throw new BookInUseException(id);
        }

        bookRepository.delete(book);
    }

    private Book findBookOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }
}
