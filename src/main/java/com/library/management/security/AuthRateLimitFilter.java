package com.library.management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.management.exception.ErrorResponse;
import com.library.management.exception.ErrorResponseFactory;
import com.library.management.exception.RateLimitExceededException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final String LOGIN_SUFFIX = "/auth/login";
    private static final String REGISTER_SUFFIX = "/auth/register";

    private final AuthRateLimitService authRateLimitService;
    private final ErrorResponseFactory errorResponseFactory;
    private final ObjectMapper objectMapper;

    public AuthRateLimitFilter(
            AuthRateLimitService authRateLimitService,
            ErrorResponseFactory errorResponseFactory,
            ObjectMapper objectMapper
    ) {
        this.authRateLimitService = authRateLimitService;
        this.errorResponseFactory = errorResponseFactory;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String path = request.getServletPath();
        return !path.endsWith(LOGIN_SUFFIX) && !path.endsWith(REGISTER_SUFFIX);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            authRateLimitService.checkLoginOrRegister(resolveClientKey(request));
            filterChain.doFilter(request, response);
        } catch (RateLimitExceededException ex) {
            ErrorResponse body = errorResponseFactory.create(
                    HttpStatus.TOO_MANY_REQUESTS,
                    ex.getMessage(),
                    request
            );
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getOutputStream(), body);
        }
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
