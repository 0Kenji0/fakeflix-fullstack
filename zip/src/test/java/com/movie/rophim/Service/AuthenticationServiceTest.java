package com.movie.rophim.Service;

import com.movie.rophim.DTO.AuthResponse;
import static org.mockito.Mockito.mock;
import com.movie.rophim.DTO.LoginRequest;
import com.movie.rophim.DTO.RegisterRequest;
import com.movie.rophim.Entity.user.RefreshToken;
import com.movie.rophim.Entity.user.Role;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.RefreshTokenRepository;
import com.movie.rophim.Repository.RoleRepository;
import com.movie.rophim.Repository.UserRepository;
import com.movie.rophim.Security.JWTService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository; // ← THÊM
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JWTService jwtService;
    @Mock private UserDetailsService userDetailsService; // ← THÊM
    // ← BỎ AuthenticationManager vì service không dùng

    @InjectMocks
    private AuthenticationService authenticationService;

    private User mockUser;
    private Role mockRole;

    @BeforeEach
    void setUp() {
        mockRole = Role.builder().id(1L).name("USER").build();
        mockUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@gmail.com")
                .password("encodedPassword")
                .roles(Set.of(mockRole))
                .build();
    }

    @Test
    void register_ShouldReturnAuthResponse_WhenValidRequest() {
        RegisterRequest request = RegisterRequest.builder()
                .username("testuser")
                .email("test@gmail.com")
                .password("123456")
                .build();

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(mockRole));
        when(passwordEncoder.encode("123456")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtService.generateToken(anyString())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken()).thenReturn("refreshToken");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(any());

        AuthResponse response = authenticationService.register(request);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("Register success", response.getMessage());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        RegisterRequest request = RegisterRequest.builder()
                .username("testuser")
                .email("test@gmail.com")
                .password("123456")
                .build();

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authenticationService.register(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void register_ShouldThrowException_WhenRoleNotFound() {
        RegisterRequest request = RegisterRequest.builder()
                .username("testuser")
                .email("test@gmail.com")
                .password("123456")
                .build();

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> authenticationService.register(request));
    }

    @Test
    void login_ShouldReturnAuthResponse_WhenValidCredentials() {
        LoginRequest request = LoginRequest.builder()
                .email("test@gmail.com")
                .password("123456")
                .build();

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("123456", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(anyString())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken()).thenReturn("refreshToken");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(mock(RefreshToken.class));
        doNothing().when(refreshTokenRepository).revokeAllByUserId(anyLong());

        AuthResponse response = authenticationService.login(request);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("Login success", response.getMessage());
        verify(userRepository, times(1)).findByEmail("test@gmail.com");
        verify(passwordEncoder, times(1)).matches("123456", "encodedPassword");
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        LoginRequest request = LoginRequest.builder()
                .email("notfound@gmail.com")
                .password("123456")
                .build();

        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authenticationService.login(request));
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void login_ShouldThrowException_WhenWrongPassword() {
        LoginRequest request = LoginRequest.builder()
                .email("test@gmail.com")
                .password("wrongpassword")
                .build();

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authenticationService.login(request));
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }
}