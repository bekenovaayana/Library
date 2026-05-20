package com.library.management.security;

import com.library.management.config.AuthProperties;
import com.library.management.exception.RateLimitExceededException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthRateLimitService {

    private final AuthProperties authProperties;
    private final Map<String, Deque<Long>> buckets = new ConcurrentHashMap<>();

    public AuthRateLimitService(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    public void checkLoginOrRegister(String clientKey) {
        int max = authProperties.getRateLimit().getLoginRegisterMax();
        long windowMs = Duration.ofSeconds(authProperties.getRateLimit().getWindowSeconds()).toMillis();

        Deque<Long> timestamps = buckets.computeIfAbsent(clientKey, key -> new ArrayDeque<>());
        synchronized (timestamps) {
            long now = System.currentTimeMillis();
            while (!timestamps.isEmpty() && timestamps.peekFirst() < now - windowMs) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= max) {
                throw new RateLimitExceededException(
                        "Too many attempts. Please try again in a minute."
                );
            }
            timestamps.addLast(now);
        }
    }
}
