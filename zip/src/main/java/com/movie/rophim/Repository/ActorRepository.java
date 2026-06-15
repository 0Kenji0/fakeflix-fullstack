package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Actor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActorRepository extends JpaRepository<Actor, Long> {
    List<Actor> findByNameContainingIgnoreCase(String keyword);
    Optional<Actor> findByNameIgnoreCase(String name); // ← THÊM
}
