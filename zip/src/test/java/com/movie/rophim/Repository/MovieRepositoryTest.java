package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.MovieStatus;
import com.movie.rophim.Entity.Movie.MovieType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class MovieRepositoryTest {

    @Autowired
    private MovieRepository movieRepository;

    @BeforeEach
    void setUp() {
        movieRepository.save(Movie.builder()
                .title("Avengers Endgame").slug("avengers-endgame")
                .featured(true).averageRating(9.0).totalViews(1000L)
                .status(MovieStatus.COMPLETED).type(MovieType.MOVIE).build());

        movieRepository.save(Movie.builder()
                .title("Some Normal Movie").slug("some-normal-movie")
                .featured(false).averageRating(5.0).totalViews(100L)
                .status(MovieStatus.COMPLETED).type(MovieType.MOVIE).build());

        movieRepository.save(Movie.builder()
                .title("Top Rated Show").slug("top-rated-show")
                .featured(false).averageRating(9.8).totalViews(500L)
                .status(MovieStatus.ONGOING).type(MovieType.SERIES).build());
    }

    @Test
    void findByFeaturedTrue_ShouldReturnOnlyFeaturedMovies() {
        List<Movie> result = movieRepository.findByFeaturedTrue();
        assertEquals(1, result.size());
        assertEquals("Avengers Endgame", result.get(0).getTitle());
        assertTrue(result.get(0).getFeatured());
    }

    @Test
    void findTop10ByOrderByAverageRatingDesc_ShouldReturnHighestRatedFirst() {
        List<Movie> result = movieRepository.findTop10ByOrderByAverageRatingDesc();
        assertFalse(result.isEmpty());
        // Phần tử đầu = rating cao nhất (9.8)
        assertEquals(9.8, result.get(0).getAverageRating());
    }

    @Test
    void findTop10ByOrderByTotalViewsDesc_ShouldReturnMostViewedFirst() {
        List<Movie> result = movieRepository.findTop10ByOrderByTotalViewsDesc();
        assertFalse(result.isEmpty());
        // Phần tử đầu = nhiều view nhất (1000)
        assertEquals(1000L, result.get(0).getTotalViews());
    }

    @Test
    void findByTitleContainingIgnoreCase_ShouldFindCaseInsensitive() {
        // LIKE '%avengers%' không phân biệt hoa thường
        List<Movie> result = movieRepository.findByTitleContainingIgnoreCase("avengers");
        assertEquals(1, result.size());
        assertEquals("Avengers Endgame", result.get(0).getTitle());
    }

    @Test
    void findByTitleContainingIgnoreCase_ShouldReturnEmpty_WhenNoMatch() {
        List<Movie> result = movieRepository.findByTitleContainingIgnoreCase("batman");
        assertTrue(result.isEmpty());
    }

    @Test
    void save_ShouldAutoSetCreatedAt() {
        Movie saved = movieRepository.save(Movie.builder()
                .title("New Movie").slug("new-movie")
                .featured(false).averageRating(0.0).totalViews(0L)
                .status(MovieStatus.COMPLETED).type(MovieType.MOVIE).build());

        assertNotNull(saved.getId());
        // @PrePersist trong BaseEntity phải tự set createdAt
        assertNotNull(saved.getCreatedAt());
    }
}
