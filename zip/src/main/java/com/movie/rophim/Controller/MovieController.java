package com.movie.rophim.Controller;

import com.movie.rophim.DTO.MovieDTO;
import com.movie.rophim.DTO.MovieRequestDTO;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.MovieStatus;
import com.movie.rophim.Entity.Movie.MovieType;
import com.movie.rophim.Repository.MovieRepository;
import com.movie.rophim.Service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public List<MovieDTO> getAllMovies() {
        return movieService.getAllMovies();
    }
    @GetMapping("/search")
    public Page<MovieDTO> searchMovies(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) MovieStatus status,
            @RequestParam(required = false) MovieType type,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) Long genreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return movieService.searchMovies(keyword, status, type, country, releaseYear, genreId, page, size);
    }



    @GetMapping("/featured")
    public List<MovieDTO> getFeaturedMovies() {
        return movieService.getFeaturedMovies();
    }

    @GetMapping("/top-rated")
    public List<MovieDTO> getTopRated() {
        return movieService.getTopRated();
    }

    @GetMapping("/most-viewed")
    public List<MovieDTO> getMostViewed() {
        return movieService.getMostViewed();
    }
    @GetMapping("/{id}")
    public MovieDTO getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MovieDTO createMovie(@Valid @RequestBody MovieRequestDTO request) {
        return movieService.createMovie(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MovieDTO updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequestDTO request) {
        return movieService.updateMovie(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return "Movie deleted successfully";
    }
}