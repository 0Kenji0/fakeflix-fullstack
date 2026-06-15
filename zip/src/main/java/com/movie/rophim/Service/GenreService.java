package com.movie.rophim.Service;

import com.movie.rophim.DTO.GenreDTO;
import com.movie.rophim.DTO.GenreRequestDTO;
import com.movie.rophim.Entity.Movie.Genre;
import com.movie.rophim.Repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;

    public List<GenreDTO> getAllGenres() {
        return genreRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    public GenreDTO getGenreById(Long id) {
        return mapToDTO(genreRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Genre not found")));
    }

    public GenreDTO createGenre(GenreRequestDTO request) {
        return mapToDTO(genreRepository.save(Genre.builder().name(request.getName()).build()));
    }

    public GenreDTO updateGenre(Long id, GenreRequestDTO request) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Genre not found"));
        genre.setName(request.getName());
        return mapToDTO(genreRepository.save(genre));
    }

    public void deleteGenre(Long id) {
        genreRepository.delete(genreRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Genre not found")));
    }

    public GenreDTO mapToDTO(Genre genre) {
        return GenreDTO.builder().id(genre.getId()).name(genre.getName()).build();
    }
}
