package com.movie.rophim.DTO;

import lombok.*;

@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RatingDTO {
    private Long id;
    private Integer stars;
    private Long movieId;
    private Long userId;
}
