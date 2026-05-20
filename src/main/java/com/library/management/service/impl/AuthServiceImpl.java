package com.library.management.service.impl;

import com.library.management.config.AuthProperties;
import com.library.management.dto.request.ChangePasswordRequest;
import com.library.management.dto.request.ForgotPasswordRequest;
import com.library.management.dto.request.LoginRequest;
import com.library.management.dto.request.LogoutRequest;
import com.library.management.dto.request.RefreshTokenRequest;
import com.library.management.dto.request.RegisterRequest;
import com.library.management.dto.request.ResetPasswordRequest;
import com.library.management.dto.response.AuthResponse;
import com.library.management.dto.response.ForgotPasswordResponse;
import com.library.management.dto.response.MessageResponse;
import com.library.management.entity.PasswordResetToken;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.exception.EmailAlreadyExistsException;
import com.library.management.exception.InvalidCurrentPasswordException;
import com.library.management.exception.InvalidPasswordResetTokenException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.exception.UsernameAlreadyExistsException;
import com.library.management.mapper.AuthMapper;
import com.library.management.repository.PasswordResetTokenRepository;
import com.library.management.repository.UserRepository;
import com.library.management.security.JwtService;
import com.library.management.service.AuthService;
import com.library.management.service.RefreshTokenService;
import com.library.management.util.SecurityUtils;
import com.library.management.util.TokenHashUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final String FORGOT_PASSWORD_MESSAGE =
            "If an account exists for this email, password reset instructions have been sent.";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final RefreshTokenService refreshTokenService;
    private final AuthProperties authProperties;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService,
            AuthMapper authMapper,
            RefreshTokenService refreshTokenService,
            AuthProperties authProperties
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.authMapper = authMapper;
        this.refreshTokenService = refreshTokenService;
        this.authProperties = authProperties;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already registered: " + request.getEmail());
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException("Username is already taken: " + request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        User user = refreshTokenService.validateAndRevoke(request.getRefreshToken());
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public MessageResponse changePassword(ChangePasswordRequest request) {
        String username = SecurityUtils.getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        refreshTokenService.revokeAllForUser(user.getId());

        return MessageResponse.builder()
                .message("Password changed successfully. Please sign in again.")
                .build();
    }

    @Override
    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        ForgotPasswordResponse.ForgotPasswordResponseBuilder response = ForgotPasswordResponse.builder()
                .message(FORGOT_PASSWORD_MESSAGE);

        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            passwordResetTokenRepository.invalidateActiveForUser(user.getId(), Instant.now());

            String plainToken = TokenHashUtils.generateOpaqueToken();
            Instant expiresAt = Instant.now().plus(
                    authProperties.getPasswordReset().getExpirationMinutes(),
                    ChronoUnit.MINUTES
            );

            PasswordResetToken entity = PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(TokenHashUtils.hashToken(plainToken))
                    .expiresAt(expiresAt)
                    .build();
            passwordResetTokenRepository.save(entity);

            log.info("Password reset requested for user id={}", user.getId());

            if (authProperties.getPasswordReset().isExposeTokenInResponse()) {
                response.resetToken(plainToken);
            }
        });

        return response.build();
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        String hash = TokenHashUtils.hashToken(request.getToken());
        PasswordResetToken stored = passwordResetTokenRepository.findByTokenHashAndUsedAtIsNull(hash)
                .orElseThrow(() -> new InvalidPasswordResetTokenException("Invalid or expired reset token"));

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidPasswordResetTokenException("Invalid or expired reset token");
        }

        User user = stored.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        stored.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(stored);
        refreshTokenService.revokeAllForUser(user.getId());

        return MessageResponse.builder()
                .message("Password has been reset. You can sign in with your new password.")
                .build();
    }

    @Override
    @Transactional
    public MessageResponse logout(LogoutRequest request) {
        if (request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
            refreshTokenService.revokeToken(request.getRefreshToken());
        }
        return MessageResponse.builder().message("Logged out successfully").build();
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = refreshTokenService.issueToken(user);
        return authMapper.toAuthResponse(user, accessToken, refreshToken);
    }
}
