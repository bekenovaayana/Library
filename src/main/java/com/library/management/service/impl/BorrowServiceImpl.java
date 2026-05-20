package com.library.management.service.impl;

import com.library.management.dto.request.BorrowRequest;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.User;
import com.library.management.exception.BookNotAvailableException;
import com.library.management.exception.BookNotFoundException;
import com.library.management.exception.BorrowAlreadyReturnedException;
import com.library.management.exception.BorrowNotFoundException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.mapper.BorrowMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.BorrowService;
import com.library.management.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowMapper borrowMapper;

    public BorrowServiceImpl(
            BorrowRecordRepository borrowRecordRepository,
            BookRepository bookRepository,
            UserRepository userRepository,
            BorrowMapper borrowMapper
    ) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.borrowMapper = borrowMapper;
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

        book.setStatus(BookStatus.BORROWED);

        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .book(book)
                .borrowDate(LocalDateTime.now())
                .build();

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

        record.setReturnDate(LocalDateTime.now());
        record.getBook().setStatus(BookStatus.AVAILABLE);

        return borrowMapper.toResponse(record);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowResponse> getMyBorrows() {
        User user = getCurrentUser();

        return borrowRecordRepository.findByUserUsernameOrderByBorrowDateDesc(user.getUsername())
                .stream()
                .map(borrowMapper::toResponse)
                .toList();
    }

    private User getCurrentUser() {
        String username = SecurityUtils.getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }
}
