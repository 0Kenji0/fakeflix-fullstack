package com.movie.rophim.Entity.Movie;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "episodes")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Episode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer episodeNumber;

    private String title;

    private String videoUrl;

    private Integer duration;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
}