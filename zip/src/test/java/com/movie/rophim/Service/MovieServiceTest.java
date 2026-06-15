package com.movie.rophim.Service;

import com.movie.rophim.DTO.MovieDTO;
import com.movie.rophim.DTO.MovieRequestDTO;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.MovieStatus;
import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;
import com.movie.rophim.Entity.Movie.MovieType;
import com.movie.rophim.Repository.ActorRepository;
import com.movie.rophim.Repository.GenreRepository;
import com.movie.rophim.Repository.MovieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // ← THÊM DÒNG NÀY
class MovieServiceTest {

    @Mock private MovieRepository movieRepository;
    @Mock private GenreRepository genreRepository;
    @Mock private ActorRepository actorRepository;

    @InjectMocks
    private MovieService movieService;

    private Movie mockMovie;
    private MovieRequestDTO mockRequest;

    @BeforeEach
    void setUp() {
        mockMovie = Movie.builder()
                .id(1L)
                .title("Avengers Endgame")
                .slug("avengers-endgame")
                .status(MovieStatus.COMPLETED)
                .type(MovieType.MOVIE)
                .averageRating(0.0)
                .totalViews(0L)
                .featured(false)
                .genres(Set.of())
                .actors(Set.of())
                .build();

        mockRequest = MovieRequestDTO.builder()
                .title("Avengers Endgame")
                .slug("avengers-endgame")
                .status(MovieStatus.COMPLETED)
                .type(MovieType.MOVIE)
                .build();
    }

    @Test
    void getAllMovies_ShouldReturnList() {
        when(movieRepository.findAll()).thenReturn(List.of(mockMovie));

        List<MovieDTO> result = movieService.getAllMovies();

        assertEquals(1, result.size());
        assertEquals("Avengers Endgame", result.get(0).getTitle());
    }

    @Test
    void getMovieById_ShouldReturnMovie_WhenExists() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(mockMovie));

        MovieDTO result = movieService.getMovieById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Avengers Endgame", result.getTitle());
    }

    @Test
    void getMovieById_ShouldThrow404_WhenNotFound() {
        when(movieRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> movieService.getMovieById(999L));
    }

    @Test
    void createMovie_ShouldReturnMovieDTO() {
        when(movieRepository.save(any(Movie.class))).thenReturn(mockMovie);
        when(genreRepository.findAllById(any())).thenReturn(List.of());
        when(actorRepository.findAllById(any())).thenReturn(List.of());

        MovieDTO result = movieService.createMovie(mockRequest);

        assertNotNull(result);
        assertEquals("Avengers Endgame", result.getTitle());
        verify(movieRepository, times(1)).save(any(Movie.class));
    }

    @Test
    void deleteMovie_ShouldDelete_WhenExists() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(mockMovie));

        movieService.deleteMovie(1L);

        verify(movieRepository, times(1)).delete(mockMovie);
    }

    @Test
    void deleteMovie_ShouldThrow404_WhenNotFound() {
        when(movieRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> movieService.deleteMovie(999L));
    }

    @Test
    void getFeaturedMovies_ShouldReturnFeaturedList() {
        Movie featuredMovie = Movie.builder()
                .id(2L).title("Featured Movie")
                .slug("featured-movie")
                .status(MovieStatus.ONGOING)
                .type(MovieType.SERIES)
                .featured(true)
                .averageRating(0.0).totalViews(0L)
                .genres(Set.of()).actors(Set.of())
                .build();

        when(movieRepository.findByFeaturedTrue()).thenReturn(List.of(featuredMovie));

        List<MovieDTO> result = movieService.getFeaturedMovies();

        assertEquals(1, result.size());
        assertEquals("Featured Movie", result.get(0).getTitle());
    }
}