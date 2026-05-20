package com.library.management.repository;

import com.library.management.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHashAndUsedAtIsNull(String tokenHash);

    @Modifying
    @Query("UPDATE PasswordResetToken prt SET prt.usedAt = :usedAt WHERE prt.user.id = :userId AND prt.usedAt IS NULL")
    void invalidateActiveForUser(@Param("userId") Long userId, @Param("usedAt") Instant usedAt);
}
