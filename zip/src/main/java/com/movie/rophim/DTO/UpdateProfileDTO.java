package com.movie.rophim.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateProfileDTO {
    private String username;
    private String imageUrl;
}