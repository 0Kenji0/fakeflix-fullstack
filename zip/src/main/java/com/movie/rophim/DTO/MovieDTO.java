package com.movie.rophim.DTO;

import com.movie.rophim.Entity.Movie.MovieStatus;
import com.movie.rophim.Entity.Movie.MovieType;
import lombok.*;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovieDTO {
    private Long id;
    private String title;
    private String description;
    private String posterUrl;
    private String bannerUrl;
    private String trailerUrl;
    private String videoUrl;
    private Integer releaseYear;
    private Integer duration;
    private String country;
    private String language;
    private String ageRating;
    private String director;
    private String cast;
    private Integer totalEpisodes;
    private Double averageRating;
    private Long totalViews;
    private Boolean featured;
    private String slug;
    private MovieStatus status;
    private MovieType type;
    private Set<GenreDTO> genres;
    private Set<ActorDTO> actors;
}