package com.library.management.service.impl;

import com.library.management.dto.response.AdminStatisticsResponse;
import com.library.management.dto.response.AdminUserResponse;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.BookStatus;
import com.library.management.entity.BorrowRecordStatus;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.exception.CannotChangeOwnRoleException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.util.SecurityUtils;
import com.library.management.mapper.AdminMapper;
import com.library.management.mapper.BorrowMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final AdminMapper adminMapper;
    private final BorrowMapper borrowMapper;

    public AdminServiceImpl(
            UserRepository userRepository,
            BookRepository bookRepository,
            BorrowRecordRepository borrowRecordRepository,
            AdminMapper adminMapper,
            BorrowMapper borrowMapper
    ) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.adminMapper = adminMapper;
        this.borrowMapper = borrowMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getAllUsers(String search, Role role, Pageable pageable) {
        String normalizedSearch = normalizeSearch(search);
        return userRepository.findAllFiltered(normalizedSearch, role, pageable)
                .map(adminMapper::toUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BorrowResponse> getAllBorrowRecords(
            String search,
            BorrowRecordStatus status,
            Pageable pageable
    ) {
        String normalizedSearch = normalizeSearch(search);
        Boolean activeOnly = resolveActiveOnly(status);
        return borrowRecordRepository.findAllFiltered(normalizedSearch, activeOnly, pageable)
                .map(borrowMapper::toResponse);
    }

    private String normalizeSearch(String search) {
        if (search == null || search.isBlank()) {
            return "";
        }
        return search.trim();
    }

    private Boolean resolveActiveOnly(BorrowRecordStatus status) {
        if (status == null) {
            return null;
        }
        return status == BorrowRecordStatus.ACTIVE ? Boolean.TRUE : Boolean.FALSE;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatisticsResponse getStatistics() {
        long borrowedBooks = bookRepository.countByStatus(BookStatus.BORROWED);
        long availableBooks = bookRepository.countByStatus(BookStatus.AVAILABLE);

        return AdminStatisticsResponse.builder()
                .totalUsers(userRepository.count())
                .totalBooks(bookRepository.count())
                .borrowedBooks(borrowedBooks)
                .availableBooks(availableBooks)
                .build();
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserRole(Long userId, Role role) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        String currentUsername = SecurityUtils.getCurrentUsername();
        if (target.getUsername().equals(currentUsername)) {
            throw new CannotChangeOwnRoleException("You cannot change your own role.");
        }

        target.setRole(role);
        return adminMapper.toUserResponse(userRepository.save(target));
    }
}
