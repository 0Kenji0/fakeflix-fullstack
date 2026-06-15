package com.movie.rophim.Entity.Movie;

import com.movie.rophim.Entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "watch_history")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    // số giây đã xem
    private Integer watchedTime;

    private LocalDateTime lastWatched;
}
