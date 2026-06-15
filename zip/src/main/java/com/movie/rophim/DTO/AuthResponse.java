package com.movie.rophim.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String message;
}