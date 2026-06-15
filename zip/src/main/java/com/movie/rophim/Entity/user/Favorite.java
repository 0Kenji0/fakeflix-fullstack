package com.movie.rophim.Entity.user;

import com.movie.rophim.Entity.Movie.Movie;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorites")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    private LocalDateTime createdAt;
}