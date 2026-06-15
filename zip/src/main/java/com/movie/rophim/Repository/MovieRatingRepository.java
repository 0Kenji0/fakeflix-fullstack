package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.MovieRating;
import com.movie.rophim.Entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRatingRepository
        extends JpaRepository<MovieRating, Long> {

    List<MovieRating> findByMovie(Movie movie);

    Optional<MovieRating> findByUserAndMovie(
            User user,
            Movie movie
    );
}
