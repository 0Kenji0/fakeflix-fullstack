package com.movie.rophim.Controller;

import com.movie.rophim.DTO.*;

import com.movie.rophim.Entity.user.RefreshToken;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Service.AuthenticationService;
import com.movie.rophim.Service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authService;
    private final OtpService otpService;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequestDTO request) {
        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        authService.logout();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // ME
    @GetMapping("/me")
    public UserDTO me() {
        return authService.me();
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email không hợp lệ"));
        }
        otpService.sendOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP đã được gửi đến " + email));
    }

    // Xác thực OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        if (!otpService.verifyOtp(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP không đúng hoặc đã hết hạn"));
        }
        return ResponseEntity.ok(Map.of("message", "OTP hợp lệ"));
    }
}