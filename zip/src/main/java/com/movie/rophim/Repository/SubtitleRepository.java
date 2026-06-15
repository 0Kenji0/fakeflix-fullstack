package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.Subtitle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubtitleRepository
        extends JpaRepository<Subtitle, Long> {

    List<Subtitle> findByMovie(Movie movie);
}