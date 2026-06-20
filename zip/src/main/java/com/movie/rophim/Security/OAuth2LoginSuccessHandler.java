package com.movie.rophim.Security;

import com.movie.rophim.DTO.AuthResponse;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Service.AuthenticationService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * Xử lý khi đăng nhập Google OAuth2 thành công:
 * - Lấy email/tên/avatar từ Google
 * - Tìm hoặc tạo user trong DB
 * - Sinh access + refresh token thật (cùng cơ chế JWT với login/register thường)
 * - Redirect về frontend kèm token qua query string
 */
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthenticationService authenticationService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String avatarUrl = oAuth2User.getAttribute("picture");

        if (email == null || email.isBlank()) {
            response.sendRedirect(
                    UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                            .queryParam("error", "oauth_no_email")
                            .build()
                            .toUriString()
            );
            return;
        }

        User user = authenticationService.findOrCreateOAuthUser(email, name, avatarUrl);
        AuthResponse authResponse = authenticationService.buildAuthResponse(user, "Google login success");

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth-callback")
                .queryParam("accessToken", authResponse.getAccessToken())
                .queryParam("refreshToken", authResponse.getRefreshToken())
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}