package com.movie.rophim.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EpisodeDTO {
    private Long id;
    private Integer episodeNumber;
    private String title;
    private String videoUrl;
    private Integer duration;
    private Long movieId;
}
