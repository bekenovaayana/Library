package com.library.management.mapper;

import com.library.management.dto.response.AdminUserResponse;
import com.library.management.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AdminMapper {

    public AdminUserResponse toUserResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
