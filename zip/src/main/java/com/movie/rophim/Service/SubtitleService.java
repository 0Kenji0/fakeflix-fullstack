package com.movie.rophim.Service;

import com.movie.rophim.DTO.SubtitleDTO;
import com.movie.rophim.DTO.SubtitleRequestDTO;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.Subtitle;
import com.movie.rophim.Repository.MovieRepository;
import com.movie.rophim.Repository.SubtitleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubtitleService {

    private final SubtitleRepository subtitleRepository;
    private final MovieRepository movieRepository;

    public List<SubtitleDTO> getSubtitlesByMovie(Long movieId) {
        Movie movie = getMovieOrThrow(movieId);
        return subtitleRepository.findByMovie(movie)
                .stream().map(this::mapToDTO).toList();
    }

    public SubtitleDTO addSubtitle(Long movieId, SubtitleRequestDTO request) {
        Movie movie = getMovieOrThrow(movieId);
        Subtitle subtitle = Subtitle.builder()
                .language(request.getLanguage())
                .subtitleUrl(request.getSubtitleUrl())
                .movie(movie)
                .build();
        return mapToDTO(subtitleRepository.save(subtitle));
    }

    public void deleteSubtitle(Long subtitleId) {
        subtitleRepository.delete(subtitleRepository.findById(subtitleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtitle not found")));
    }

    private Movie getMovieOrThrow(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
    }

    private SubtitleDTO mapToDTO(Subtitle s) {
        return SubtitleDTO.builder()
                .id(s.getId()).language(s.getLanguage())
                .subtitleUrl(s.getSubtitleUrl())
                .movieId(s.getMovie().getId())
                .build();
    }
}