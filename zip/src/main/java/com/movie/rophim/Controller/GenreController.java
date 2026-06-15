package com.movie.rophim.Controller;

import com.movie.rophim.DTO.GenreDTO;
import com.movie.rophim.DTO.GenreRequestDTO;
import com.movie.rophim.Service.GenreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping
    public List<GenreDTO> getAllGenres() { return genreService.getAllGenres(); }

    @GetMapping("/{id}")
    public GenreDTO getGenreById(@PathVariable Long id) { return genreService.getGenreById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public GenreDTO createGenre(@Valid @RequestBody GenreRequestDTO request) {
        return genreService.createGenre(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public GenreDTO updateGenre(@PathVariable Long id, @Valid @RequestBody GenreRequestDTO request) {
        return genreService.updateGenre(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteGenre(@PathVariable Long id) { genreService.deleteGenre(id); return "Genre deleted successfully"; }
}