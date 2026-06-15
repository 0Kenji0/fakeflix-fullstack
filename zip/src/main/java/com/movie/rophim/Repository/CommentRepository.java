package com.movie.rophim.Repository;


import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.user.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    List<Comment> findByMovie(Movie movie);
    Page<Comment> findByMovie(Movie movie, Pageable pageable);
}