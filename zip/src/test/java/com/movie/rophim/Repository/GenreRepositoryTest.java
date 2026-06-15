package com.movie.rophim.Repository;

import com.movie.rophim.Entity.Movie.Genre;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
@Transactional
class GenreRepositoryTest {

    @Autowired
    private GenreRepository genreRepository;

    @BeforeEach
    void setUp() {
        genreRepository.save(Genre.builder().name("Action").build());
        genreRepository.save(Genre.builder().name("Comedy").build());
    }

    @Test
    void findAll_ShouldReturnAllGenres() {
        List<Genre> result = genreRepository.findAll();
        assertEquals(2, result.size());
    }

    @Test
    void save_ShouldPersistGenre() {
        Genre saved = genreRepository.save(Genre.builder().name("Horror").build());
        assertNotNull(saved.getId());
        assertEquals("Horror", saved.getName());
    }

    @Test
    void findByName_ShouldReturnGenre_WhenExists() {
        Optional<Genre> result = genreRepository.findByName("Action");
        assertTrue(result.isPresent());
        assertEquals("Action", result.get().getName());
    }

    @Test
    void findByName_ShouldReturnEmpty_WhenNotExists() {
        Optional<Genre> result = genreRepository.findByName("SciFi");
        assertFalse(result.isPresent());
    }

    @Test
    void delete_ShouldRemoveGenreFromDB() {
        Genre genre = genreRepository.findByName("Action").get();
        genreRepository.delete(genre);
        assertFalse(genreRepository.findByName("Action").isPresent());
    }

    @Test
    void findById_ShouldReturnGenre_WhenExists() {
        Genre saved = genreRepository.save(Genre.builder().name("Drama").build());
        Optional<Genre> result = genreRepository.findById(saved.getId());
        assertTrue(result.isPresent());
        assertEquals("Drama", result.get().getName());
    }
}
