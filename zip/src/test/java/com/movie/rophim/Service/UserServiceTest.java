package com.movie.rophim.Service;

import com.movie.rophim.DTO.ChangePasswordDTO;
import com.movie.rophim.DTO.UpdateProfileDTO;
import com.movie.rophim.DTO.UserDTO;
import com.movie.rophim.Entity.user.Role;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.RoleRepository;
import com.movie.rophim.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // ← THÊM DÒNG NÀY
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private SecurityContext securityContext;
    @Mock private Authentication authentication;
    @Mock private UserDetails userDetails;

    @InjectMocks
    private UserService userService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        Role userRole = Role.builder().id(1L).name("USER").build();
        mockUser = User.builder()
                .id(1L).username("testuser")
                .email("test@gmail.com")
                .password("encodedPassword")
                .roles(Set.of(userRole))
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@gmail.com");
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getAllUsers_ShouldReturnList() {
        when(userRepository.findAll()).thenReturn(List.of(mockUser));

        List<UserDTO> result = userService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals("testuser", result.get(0).getUsername());
    }

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        UserDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
    }

    @Test
    void getUserById_ShouldThrow404_WhenNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> userService.getUserById(999L));
    }

    @Test
    void updateMyProfile_ShouldUpdateUsername() {
        UpdateProfileDTO request = UpdateProfileDTO.builder()
                .username("newname").build();
        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        UserDTO result = userService.updateMyProfile(request);

        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void changePassword_ShouldThrow400_WhenOldPasswordWrong() {
        ChangePasswordDTO request = ChangePasswordDTO.builder()
                .oldPassword("wrongpassword")
                .newPassword("newpassword123")
                .build();
        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword"))
                .thenReturn(false);

        assertThrows(ResponseStatusException.class,
                () -> userService.changePassword(request));
    }

    @Test
    void changePassword_ShouldSucceed_WhenOldPasswordCorrect() {
        ChangePasswordDTO request = ChangePasswordDTO.builder()
                .oldPassword("123456")
                .newPassword("newpassword123")
                .build();
        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("123456", "encodedPassword"))
                .thenReturn(true);
        when(passwordEncoder.encode("newpassword123")).thenReturn("newEncoded");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        assertDoesNotThrow(() -> userService.changePassword(request));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deleteUser_ShouldDelete_WhenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).delete(mockUser);
    }
}