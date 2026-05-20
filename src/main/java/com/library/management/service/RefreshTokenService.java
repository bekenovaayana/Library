package com.library.management.service;

import com.library.management.entity.User;

public interface RefreshTokenService {

    String issueToken(User user);

    User validateAndRevoke(String plainToken);

    void revokeToken(String plainToken);

    void revokeAllForUser(Long userId);
}
