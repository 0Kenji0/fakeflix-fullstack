package com.movie.rophim.Entity.Movie;

import com.movie.rophim.Entity.Base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "movies")
public class Movie extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
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

    @Column(name = "movie_cast", columnDefinition = "TEXT")
    private String cast;

    private Integer totalEpisodes;

    @Builder.Default
    private Long totalViews = 0L;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Boolean featured = false;

    @Column(unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    private MovieStatus status;

    @Enumerated(EnumType.STRING)
    private MovieType type;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    // Thêm mới
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "movie_actors",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "actor_id")
    )
    private Set<Actor> actors = new HashSet<>();
}