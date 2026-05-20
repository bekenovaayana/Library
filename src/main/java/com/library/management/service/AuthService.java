package com.library.management.service;

import com.library.management.dto.request.ChangePasswordRequest;
import com.library.management.dto.request.ForgotPasswordRequest;
import com.library.management.dto.request.LoginRequest;
import com.library.management.dto.request.LogoutRequest;
import com.library.management.dto.request.RefreshTokenRequest;
import com.library.management.dto.request.RegisterRequest;
import com.library.management.dto.request.ResetPasswordRequest;
import com.library.management.dto.response.AuthResponse;
import com.library.management.dto.response.ForgotPasswordResponse;
import com.library.management.dto.response.MessageResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshTokenRequest request);

    MessageResponse changePassword(ChangePasswordRequest request);

    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);

    MessageResponse resetPassword(ResetPasswordRequest request);

    MessageResponse logout(LogoutRequest request);
}
