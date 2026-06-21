package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.MovieStatus;
import com.movie.rophim.Entity.Movie.MovieType;
import org.springframework.data.jpa.domain.Specification;

public class MovieSpecification {

    public static Specification<Movie> hasKeyword(String keyword) {
        return (root, query, cb) -> keyword == null || keyword.isBlank() ? null :
                cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Movie> hasStatus(MovieStatus status) {
        return (root, query, cb) -> status == null ? null :
                cb.equal(root.get("status"), status);
    }

    public static Specification<Movie> hasType(MovieType type) {
        return (root, query, cb) -> type == null ? null :
                cb.equal(root.get("type"), type);
    }

    public static Specification<Movie> hasCountry(String country) {
        return (root, query, cb) -> country == null || country.isBlank() ? null :
                cb.equal(cb.lower(root.get("country")), country.toLowerCase());
    }

    public static Specification<Movie> hasReleaseYear(Integer year) {
        return (root, query, cb) -> year == null ? null :
                cb.equal(root.get("releaseYear"), year);
    }

    public static Specification<Movie> hasGenreId(Long genreId) {
        return (root, query, cb) -> {
            if (genreId == null) return null;
            // tránh trùng dòng do join ManyToMany
            query.distinct(true);
            return cb.equal(root.join("genres").get("id"), genreId);
        };
    }
}