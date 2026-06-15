package com.movie.rophim.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchHistoryDTO {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private String posterUrl;
    private Integer watchedTime;
    private LocalDateTime lastWatched;
}