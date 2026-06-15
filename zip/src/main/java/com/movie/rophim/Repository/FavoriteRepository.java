package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.user.Favorite;
import com.movie.rophim.Entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository
        extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUser(User user);

    Optional<Favorite> findByUserAndMovie(
            User user,
            Movie movie
    );
    Page<Favorite> findByUser(User user, Pageable pageable);
}
