package com.movie.rophim.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteDTO {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private String posterUrl;
    private LocalDateTime createdAt;
}