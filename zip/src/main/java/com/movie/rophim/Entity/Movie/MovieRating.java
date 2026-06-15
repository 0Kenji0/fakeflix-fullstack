package com.movie.rophim.Entity.Movie;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Entity.Base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movie_ratings")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class MovieRating extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer stars;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
}