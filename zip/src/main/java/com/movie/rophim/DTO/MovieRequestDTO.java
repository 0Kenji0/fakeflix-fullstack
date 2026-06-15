package com.movie.rophim.DTO;

import com.movie.rophim.Entity.Movie.MovieStatus;
import com.movie.rophim.Entity.Movie.MovieType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovieRequestDTO {

    @NotBlank(message = "Title is required")
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
    private Boolean featured;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotNull(message = "Status is required")
    private MovieStatus status;

    @NotNull(message = "Type is required")
    private MovieType type;

    private Set<Long> genreIds;
    private Set<Long> actorIds;
}