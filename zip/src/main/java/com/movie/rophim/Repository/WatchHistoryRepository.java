package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.WatchHistory;
import com.movie.rophim.Entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    List<WatchHistory> findByUserOrderByLastWatchedDesc(User user);
    Optional<WatchHistory> findByUserAndMovie(User user, Movie movie);
    Page<WatchHistory> findByUserOrderByLastWatchedDesc(User user, Pageable pageable);
}