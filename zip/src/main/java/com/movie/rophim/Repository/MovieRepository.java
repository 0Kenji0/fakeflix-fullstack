package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.MovieStatus;
import com.movie.rophim.Entity.Movie.MovieType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long>,
        JpaSpecificationExecutor<Movie> {

    List<Movie> findByTitleContainingIgnoreCase(String keyword);
    List<Movie> findByFeaturedTrue();
    List<Movie> findTop10ByOrderByAverageRatingDesc();
    List<Movie> findTop10ByOrderByTotalViewsDesc();
}

