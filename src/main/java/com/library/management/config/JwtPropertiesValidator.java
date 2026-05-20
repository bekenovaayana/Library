package com.library.management.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@Profile("prod")
public class JwtPropertiesValidator {

    private final JwtProperties jwtProperties;

    public JwtPropertiesValidator(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    @PostConstruct
    void validate() {
        if (!StringUtils.hasText(jwtProperties.getSecretKey()) || jwtProperties.getSecretKey().length() < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET must be set and at least 32 characters long in production"
            );
        }
    }
}
