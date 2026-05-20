package com.library.management.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "application.auth")
public class AuthProperties {

    private final RateLimit rateLimit = new RateLimit();
    private final RefreshToken refreshToken = new RefreshToken();
    private final PasswordReset passwordReset = new PasswordReset();

    @Getter
    @Setter
    public static class RateLimit {
        private int loginRegisterMax = 10;
        private int windowSeconds = 60;
    }

    @Getter
    @Setter
    public static class RefreshToken {
        private long expirationDays = 7;
    }

    @Getter
    @Setter
    public static class PasswordReset {
        private int expirationMinutes = 60;
        private boolean exposeTokenInResponse = false;
    }
}
