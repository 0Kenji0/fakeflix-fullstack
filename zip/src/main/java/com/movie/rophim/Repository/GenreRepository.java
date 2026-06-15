package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GenreRepository
        extends JpaRepository<Genre, Long> {

    Optional<Genre> findByName(String name);
}