package com.library.management.mapper;

import com.library.management.dto.response.AuthResponse;
import com.library.management.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthResponse toAuthResponse(User user, String token, String refreshToken) {
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .username(user.getUsername())
                .build();
    }
}
