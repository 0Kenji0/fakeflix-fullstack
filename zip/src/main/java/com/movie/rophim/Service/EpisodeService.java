package com.movie.rophim.Service;

import com.movie.rophim.DTO.EpisodeDTO;
import com.movie.rophim.DTO.EpisodeRequestDTO;
import com.movie.rophim.Entity.Movie.Episode;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Repository.EpisodeRepository;
import com.movie.rophim.Repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EpisodeService {

    private final EpisodeRepository episodeRepository;
    private final MovieRepository movieRepository;

    public List<EpisodeDTO> getEpisodesByMovie(Long movieId) {
        Movie movie = getMovieOrThrow(movieId);
        return episodeRepository.findByMovieOrderByEpisodeNumberAsc(movie)
                .stream().map(this::mapToDTO).toList();
    }

    public EpisodeDTO getEpisodeById(Long movieId, Long episodeId) {
        return mapToDTO(getEpisodeOrThrow(movieId, episodeId));
    }

    public EpisodeDTO createEpisode(Long movieId, EpisodeRequestDTO request) {
        Movie movie = getMovieOrThrow(movieId);
        Episode episode = Episode.builder()
                .episodeNumber(request.getEpisodeNumber())
                .title(request.getTitle())
                .videoUrl(request.getVideoUrl())
                .duration(request.getDuration())
                .movie(movie)
                .build();
        return mapToDTO(episodeRepository.save(episode));
    }

    public EpisodeDTO updateEpisode(Long movieId, Long episodeId, EpisodeRequestDTO request) {
        Episode episode = getEpisodeOrThrow(movieId, episodeId);
        episode.setEpisodeNumber(request.getEpisodeNumber());
        episode.setTitle(request.getTitle());
        episode.setVideoUrl(request.getVideoUrl());
        episode.setDuration(request.getDuration());
        return mapToDTO(episodeRepository.save(episode));
    }

    public void deleteEpisode(Long movieId, Long episodeId) {
        episodeRepository.delete(getEpisodeOrThrow(movieId, episodeId));
    }

    private Movie getMovieOrThrow(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
    }

    private Episode getEpisodeOrThrow(Long movieId, Long episodeId) {
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Episode not found"));
        if (!episode.getMovie().getId().equals(movieId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Episode does not belong to this movie");
        return episode;
    }

    private EpisodeDTO mapToDTO(Episode e) {
        return EpisodeDTO.builder()
                .id(e.getId()).episodeNumber(e.getEpisodeNumber())
                .title(e.getTitle()).videoUrl(e.getVideoUrl())
                .duration(e.getDuration()).movieId(e.getMovie().getId())
                .build();
    }
}