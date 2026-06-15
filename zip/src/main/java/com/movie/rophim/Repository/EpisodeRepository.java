package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Episode;
import com.movie.rophim.Entity.Movie.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EpisodeRepository
        extends JpaRepository<Episode, Long> {

    List<Episode> findByMovie(Movie movie);

    List<Episode> findByMovieOrderByEpisodeNumberAsc(
            Movie movie
    );
}