package com.library.management.service.impl;

import com.library.management.config.LibraryProperties;
import com.library.management.dto.request.UpdateProfileRequest;
import com.library.management.dto.response.UserProfileResponse;
import com.library.management.entity.User;
import com.library.management.exception.EmailAlreadyExistsException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.exception.UsernameAlreadyExistsException;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.UserProfileService;
import com.library.management.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final LibraryProperties libraryProperties;

    public UserProfileServiceImpl(
            UserRepository userRepository,
            BorrowRecordRepository borrowRecordRepository,
            LibraryProperties libraryProperties
    ) {
        this.userRepository = userRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.libraryProperties = libraryProperties;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile() {
        User user = getCurrentUser();
        int active = (int) borrowRecordRepository.countByUserIdAndReturnDateIsNull(user.getId());
        return toResponse(user, active);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new EmailAlreadyExistsException("Email is already registered: " + request.getEmail());
            }
            user.setEmail(request.getEmail().trim());
        }

        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new UsernameAlreadyExistsException("Username is already taken: " + request.getUsername());
            }
            user.setUsername(request.getUsername().trim());
        }

        User saved = userRepository.save(user);
        int active = (int) borrowRecordRepository.countByUserIdAndReturnDateIsNull(saved.getId());
        return toResponse(saved, active);
    }

    private UserProfileResponse toResponse(User user, int activeBorrows) {
        return UserProfileResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .activeBorrows(activeBorrows)
                .maxBooksPerUser(libraryProperties.getMaxBooksPerUser())
                .build();
    }

    private User getCurrentUser() {
        String username = SecurityUtils.getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }
}
