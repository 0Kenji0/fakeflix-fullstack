package com.movie.rophim.Service;

import com.movie.rophim.DTO.GenreDTO;
import com.movie.rophim.DTO.GenreRequestDTO;
import com.movie.rophim.Entity.Movie.Genre;
import com.movie.rophim.Repository.GenreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GenreServiceTest {

    @Mock private GenreRepository genreRepository;

    @InjectMocks
    private GenreService genreService;

    private Genre mockGenre;

    @BeforeEach
    void setUp() {
        mockGenre = Genre.builder().id(1L).name("Action").build();
    }

    @Test
    void getAllGenres_ShouldReturnList() {
        when(genreRepository.findAll()).thenReturn(List.of(mockGenre));

        List<GenreDTO> result = genreService.getAllGenres();

        assertEquals(1, result.size());
        assertEquals("Action", result.get(0).getName());
    }

    @Test
    void getGenreById_ShouldReturnGenre_WhenExists() {
        when(genreRepository.findById(1L)).thenReturn(Optional.of(mockGenre));

        GenreDTO result = genreService.getGenreById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Action", result.getName());
    }

    @Test
    void getGenreById_ShouldThrow404_WhenNotFound() {
        when(genreRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> genreService.getGenreById(999L));
    }

    @Test
    void createGenre_ShouldReturnGenreDTO() {
        GenreRequestDTO request = GenreRequestDTO.builder().name("Action").build();
        when(genreRepository.save(any(Genre.class))).thenReturn(mockGenre);

        GenreDTO result = genreService.createGenre(request);

        assertNotNull(result);
        assertEquals("Action", result.getName());
        verify(genreRepository, times(1)).save(any(Genre.class));
    }

    @Test
    void updateGenre_ShouldReturnUpdated_WhenExists() {
        GenreRequestDTO request = GenreRequestDTO.builder().name("Comedy").build();
        Genre updatedGenre = Genre.builder().id(1L).name("Comedy").build();

        when(genreRepository.findById(1L)).thenReturn(Optional.of(mockGenre));
        when(genreRepository.save(any(Genre.class))).thenReturn(updatedGenre);

        GenreDTO result = genreService.updateGenre(1L, request);

        assertEquals("Comedy", result.getName());
    }

    @Test
    void deleteGenre_ShouldDelete_WhenExists() {
        when(genreRepository.findById(1L)).thenReturn(Optional.of(mockGenre));

        genreService.deleteGenre(1L);

        verify(genreRepository, times(1)).delete(mockGenre);
    }

    @Test
    void deleteGenre_ShouldThrow404_WhenNotFound() {
        when(genreRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> genreService.deleteGenre(999L));
    }
}