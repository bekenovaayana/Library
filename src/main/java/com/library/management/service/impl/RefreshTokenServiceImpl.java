package com.library.management.service.impl;

import com.library.management.config.AuthProperties;
import com.library.management.entity.RefreshToken;
import com.library.management.entity.User;
import com.library.management.exception.InvalidRefreshTokenException;
import com.library.management.repository.RefreshTokenRepository;
import com.library.management.service.RefreshTokenService;
import com.library.management.util.TokenHashUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthProperties authProperties;

    public RefreshTokenServiceImpl(
            RefreshTokenRepository refreshTokenRepository,
            AuthProperties authProperties
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.authProperties = authProperties;
    }

    @Override
    @Transactional
    public String issueToken(User user) {
        String plainToken = TokenHashUtils.generateOpaqueToken();
        Instant expiresAt = Instant.now().plus(
                authProperties.getRefreshToken().getExpirationDays(),
                ChronoUnit.DAYS
        );

        RefreshToken entity = RefreshToken.builder()
                .user(user)
                .tokenHash(TokenHashUtils.hashToken(plainToken))
                .expiresAt(expiresAt)
                .build();

        refreshTokenRepository.save(entity);
        return plainToken;
    }

    @Override
    @Transactional
    public User validateAndRevoke(String plainToken) {
        RefreshToken stored = findActiveToken(plainToken);
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);
        return stored.getUser();
    }

    @Override
    @Transactional
    public void revokeToken(String plainToken) {
        refreshTokenRepository.findByTokenHashAndRevokedFalse(TokenHashUtils.hashToken(plainToken))
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }

    @Override
    @Transactional
    public void revokeAllForUser(Long userId) {
        refreshTokenRepository.revokeAllActiveForUser(userId);
    }

    private RefreshToken findActiveToken(String plainToken) {
        String hash = TokenHashUtils.hashToken(plainToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHashAndRevokedFalse(hash)
                .orElseThrow(() -> new InvalidRefreshTokenException("Invalid or expired refresh token"));

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            stored.setRevoked(true);
            refreshTokenRepository.save(stored);
            throw new InvalidRefreshTokenException("Invalid or expired refresh token");
        }

        return stored;
    }
}
