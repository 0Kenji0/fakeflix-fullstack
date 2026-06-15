package com.movie.rophim.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SubtitleRequestDTO {
    private String language;
    private String subtitleUrl;
}