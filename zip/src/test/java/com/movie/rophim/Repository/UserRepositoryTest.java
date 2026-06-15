package com.movie.rophim.Repository;

import com.movie.rophim.Entity.user.RefreshToken;
import com.movie.rophim.Entity.user.Role;
import com.movie.rophim.Entity.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private User savedUser;

    @BeforeEach
    void setUp() {
        // DataInitializer đã tạo "USER" role khi @SpringBootTest khởi động
        // → dùng findByName, KHÔNG save lại (sẽ lỗi unique constraint)
        Role role = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("USER").build()));
        savedUser = userRepository.save(User.builder()
                .username("testuser")
                .email("test@gmail.com")
                .password("encodedPassword")
                .roles(Set.of(role))
                .build());
    }

    // ─── UserRepository ────────────────────────────────────────────────────

    @Test
    void findByEmail_ShouldReturnUser_WhenExists() {
        Optional<User> result = userRepository.findByEmail("test@gmail.com");
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenNotExists() {
        Optional<User> result = userRepository.findByEmail("ghost@gmail.com");
        assertFalse(result.isPresent());
    }

    @Test
    void findByUsername_ShouldReturnUser_WhenExists() {
        Optional<User> result = userRepository.findByUsername("testuser");
        assertTrue(result.isPresent());
        assertEquals("test@gmail.com", result.get().getEmail());
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenExists() {
        assertTrue(userRepository.existsByEmail("test@gmail.com"));
    }

    @Test
    void existsByEmail_ShouldReturnFalse_WhenNotExists() {
        assertFalse(userRepository.existsByEmail("nobody@gmail.com"));
    }

    @Test
    void existsByUsername_ShouldReturnTrue_WhenExists() {
        assertTrue(userRepository.existsByUsername("testuser"));
    }

    // ─── RefreshTokenRepository ────────────────────────────────────────────

    @Test
    void findByToken_ShouldReturnToken_WhenExists() {
        refreshTokenRepository.save(RefreshToken.builder()
                .token("abc-token").user(savedUser).revoked(false)
                .expiresAt(LocalDateTime.now().plusDays(7)).build());

        Optional<RefreshToken> result = refreshTokenRepository.findByToken("abc-token");
        assertTrue(result.isPresent());
        assertFalse(result.get().isRevoked());
    }

    @Test
    void revokeAllByUserId_ShouldSetRevokedTrue_ForAllUserTokens() {
        // Insert 2 token active cho cùng user
        refreshTokenRepository.save(RefreshToken.builder()
                .token("token-one").user(savedUser).revoked(false)
                .expiresAt(LocalDateTime.now().plusDays(7)).build());
        refreshTokenRepository.save(RefreshToken.builder()
                .token("token-two").user(savedUser).revoked(false)
                .expiresAt(LocalDateTime.now().plusDays(7)).build());

        // Chạy custom JPQL: UPDATE RefreshToken SET revoked=true WHERE user.id=?
        refreshTokenRepository.revokeAllByUserId(savedUser.getId());

        // Cả 2 token phải bị revoked
        List<RefreshToken> all = refreshTokenRepository.findAll();
        assertTrue(all.stream().allMatch(RefreshToken::isRevoked));
    }

    @Test
    void revokeAllByUserId_ShouldNotAffectOtherUsersTokens() {
        User otherUser = userRepository.save(User.builder()
                .username("other").email("other@gmail.com").password("pass").build());

        refreshTokenRepository.save(RefreshToken.builder()
                .token("my-token").user(savedUser).revoked(false)
                .expiresAt(LocalDateTime.now().plusDays(7)).build());
        refreshTokenRepository.save(RefreshToken.builder()
                .token("other-token").user(otherUser).revoked(false)
                .expiresAt(LocalDateTime.now().plusDays(7)).build());

        // Chỉ revoke token của savedUser
        refreshTokenRepository.revokeAllByUserId(savedUser.getId());

        // Token của otherUser vẫn phải active
        Optional<RefreshToken> otherToken = refreshTokenRepository.findByToken("other-token");
        assertTrue(otherToken.isPresent());
        assertFalse(otherToken.get().isRevoked());

        // Token của savedUser phải bị revoke
        Optional<RefreshToken> myToken = refreshTokenRepository.findByToken("my-token");
        assertTrue(myToken.isPresent());
        assertTrue(myToken.get().isRevoked());
    }
}
