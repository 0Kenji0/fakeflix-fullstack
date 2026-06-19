package com.movie.rophim.Security;

import com.movie.rophim.Entity.user.Role;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.RoleRepository;
import com.movie.rophim.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JWTService jwtService;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Role USER not found"));

            User newUser = User.builder()
                    .username(generateUsername(name, email))
                    .email(email)
                    .password(new BCryptPasswordEncoder().encode(UUID.randomUUID().toString()))
                    .imageUrl(picture)
                    .createdAt(LocalDateTime.now())
                    .roles(new HashSet<>(java.util.Set.of(userRole)))
                    .build();

            return userRepository.save(newUser);
        });

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken();

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }

    private String generateUsername(String name, String email) {
        if (name != null && !name.isBlank()) {
            return name.replaceAll("\\s+", "").toLowerCase() + UUID.randomUUID().toString().substring(0, 4);
        }
        return email.split("@")[0] + UUID.randomUUID().toString().substring(0, 4);
    }
}