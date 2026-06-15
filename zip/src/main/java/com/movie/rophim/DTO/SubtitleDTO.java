package com.movie.rophim.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SubtitleDTO {
    private Long id;
    private String language;
    private String subtitleUrl;
    private Long movieId;
}
