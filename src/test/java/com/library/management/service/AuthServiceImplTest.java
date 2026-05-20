package com.library.management.service;

import com.library.management.config.AuthProperties;
import com.library.management.dto.request.LoginRequest;
import com.library.management.dto.request.RegisterRequest;
import com.library.management.dto.response.AuthResponse;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.exception.EmailAlreadyExistsException;
import com.library.management.exception.UserNotFoundException;
import com.library.management.exception.UsernameAlreadyExistsException;
import com.library.management.mapper.AuthMapper;
import com.library.management.repository.PasswordResetTokenRepository;
import com.library.management.repository.UserRepository;
import com.library.management.security.JwtService;
import com.library.management.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthMapper authMapper;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private AuthProperties authProperties;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_whenValidRequest_shouldReturnAuthResponse() {
        RegisterRequest request = RegisterRequest.builder()
                .username("john")
                .email("john@example.com")
                .password("password123")
                .build();

        User savedUser = User.builder()
                .id(1L)
                .username("john")
                .email("john@example.com")
                .password("encoded")
                .role(Role.USER)
                .build();

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("john")
                .password("encoded")
                .roles("USER")
                .build();

        AuthResponse expected = AuthResponse.builder()
                .token("access-token")
                .refreshToken("refresh-token")
                .username("john")
                .role(Role.USER)
                .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(userDetailsService.loadUserByUsername("john")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("access-token");
        when(refreshTokenService.issueToken(savedUser)).thenReturn("refresh-token");
        when(authMapper.toAuthResponse(savedUser, "access-token", "refresh-token")).thenReturn(expected);

        AuthResponse result = authService.register(request);

        assertThat(result.getToken()).isEqualTo("access-token");
        assertThat(result.getRefreshToken()).isEqualTo("refresh-token");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_whenEmailExists_shouldThrowException() {
        RegisterRequest request = RegisterRequest.builder()
                .username("john")
                .email("john@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("john@example.com");
    }

    @Test
    void register_whenUsernameExists_shouldThrowException() {
        RegisterRequest request = RegisterRequest.builder()
                .username("john")
                .email("john@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(UsernameAlreadyExistsException.class)
                .hasMessageContaining("john");
    }

    @Test
    void login_whenValidCredentials_shouldReturnAuthResponse() {
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();

        User user = User.builder()
                .id(1L)
                .username("john")
                .email("john@example.com")
                .password("encoded")
                .role(Role.USER)
                .build();

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("john")
                .password("encoded")
                .roles("USER")
                .build();

        AuthResponse expected = AuthResponse.builder()
                .token("access-token")
                .refreshToken("refresh-token")
                .username("john")
                .role(Role.USER)
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername("john")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("access-token");
        when(refreshTokenService.issueToken(user)).thenReturn("refresh-token");
        when(authMapper.toAuthResponse(user, "access-token", "refresh-token")).thenReturn(expected);

        AuthResponse result = authService.login(request);

        assertThat(result.getToken()).isEqualTo("access-token");
        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("john", "password123")
        );
    }

    @Test
    void login_whenUserNotFound_shouldThrowException() {
        LoginRequest request = LoginRequest.builder()
                .email("missing@example.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(UserNotFoundException.class);
    }
}
