package com.movie.rophim.Service;

import com.movie.rophim.DTO.AuthResponse;
import com.movie.rophim.DTO.LoginRequest;
import com.movie.rophim.DTO.RegisterRequest;
import com.movie.rophim.DTO.UserDTO;
import com.movie.rophim.Entity.user.RefreshToken;
import com.movie.rophim.Entity.user.Role;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.RefreshTokenRepository;
import com.movie.rophim.Repository.RoleRepository;
import com.movie.rophim.Repository.UserRepository;
import com.movie.rophim.Security.JWTService;
import lombok.RequiredArgsConstructor;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;

    @Value("${jwt.refresh-expiration-days:7}")
    private long refreshExpirationDays;

    // REGISTER
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // FIX: tìm "USER" khớp với DataInitializer save "USER"
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        return buildAuthResponse(user, "Register success");
    }

    // LOGIN
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // Thu hồi tất cả refresh token cũ
        refreshTokenRepository.revokeAllByUserId(user.getId());

        return buildAuthResponse(user, "Login success");
    }

    // REFRESH TOKEN
    public AuthResponse refresh(String refreshTokenStr) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(refreshTokenStr)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (refreshToken.isRevoked()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token revoked");
        }

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        User user = refreshToken.getUser();

        // Thu hồi token cũ, cấp token mới
        refreshTokenRepository.revokeAllByUserId(user.getId());

        return buildAuthResponse(user, "Token refreshed");
    }

    // LOGOUT
    public void logout() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        refreshTokenRepository.revokeAllByUserId(user.getId());
    }

    // ME
    public UserDTO me() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .createdAt(user.getCreatedAt())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName())
                        .collect(Collectors.toSet()))
                .build();
    }
    // HELPER: tạo access + refresh token
    private AuthResponse buildAuthResponse(User user, String message) {

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshTokenStr = jwtService.generateRefreshToken();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenStr)
                .user(user)
                .revoked(false)
                .expiresAt(LocalDateTime.now().plusDays(refreshExpirationDays))
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .message(message)
                .build();
    }
}