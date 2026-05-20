package com.library.management.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.management.dto.request.LoginRequest;
import com.library.management.dto.request.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_whenValidRequest_shouldReturnCreated() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .username("integration_user")
                .email("integration@example.com")
                .password("password123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.username").value("integration_user"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void register_whenEmailAlreadyExists_shouldReturnConflict() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .username("user_one")
                .email("duplicate@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        RegisterRequest duplicate = RegisterRequest.builder()
                .username("user_two")
                .email("duplicate@example.com")
                .password("password123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void login_whenValidCredentials_shouldReturnOk() throws Exception {
        // Arrange
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("login_user")
                .email("login@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        LoginRequest loginRequest = LoginRequest.builder()
                .email("login@example.com")
                .password("password123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.username").value("login_user"));
    }

    @Test
    void refresh_whenValidRefreshToken_shouldReturnNewTokens() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("refresh_user")
                .email("refresh@example.com")
                .password("password123")
                .build();

        String registerBody = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String refreshToken = objectMapper.readTree(registerBody).get("refreshToken").asText();

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"" + refreshToken + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.username").value("refresh_user"));
    }

    @Test
    void forgotPassword_whenEmailExists_shouldReturnResetTokenInTestProfile() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("reset_user")
                .email("reset@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"reset@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resetToken").isNotEmpty());
    }

    @Test
    void login_whenInvalidPassword_shouldReturnUnauthorized() throws Exception {
        // Arrange
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("wrong_pass_user")
                .email("wrongpass@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        LoginRequest loginRequest = LoginRequest.builder()
                .email("wrongpass@example.com")
                .password("wrongpassword")
                .build();

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void login_whenUserNotFound_shouldReturnNotFound() throws Exception {
        // Arrange
        LoginRequest loginRequest = LoginRequest.builder()
                .email("missing@example.com")
                .password("password123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void register_whenInvalidRequest_shouldReturnBadRequest() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .username("ab")
                .email("invalid-email")
                .password("short")
                .build();

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors").isArray());
    }
}
