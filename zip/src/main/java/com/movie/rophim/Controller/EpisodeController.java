package com.movie.rophim.Controller;

import com.movie.rophim.DTO.EpisodeDTO;
import com.movie.rophim.DTO.EpisodeRequestDTO;
import com.movie.rophim.Service.EpisodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies/{movieId}/episodes")
@RequiredArgsConstructor
public class EpisodeController {

    private final EpisodeService episodeService;

    @GetMapping
    public List<EpisodeDTO> getEpisodes(@PathVariable Long movieId) { return episodeService.getEpisodesByMovie(movieId); }

    @GetMapping("/{episodeId}")
    public EpisodeDTO getEpisode(@PathVariable Long movieId, @PathVariable Long episodeId) { return episodeService.getEpisodeById(movieId, episodeId); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EpisodeDTO createEpisode(@PathVariable Long movieId, @RequestBody EpisodeRequestDTO request) { return episodeService.createEpisode(movieId, request); }

    @PutMapping("/{episodeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public EpisodeDTO updateEpisode(@PathVariable Long movieId, @PathVariable Long episodeId, @RequestBody EpisodeRequestDTO request) { return episodeService.updateEpisode(movieId, episodeId, request); }

    @DeleteMapping("/{episodeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteEpisode(@PathVariable Long movieId, @PathVariable Long episodeId) { episodeService.deleteEpisode(movieId, episodeId); return "Episode deleted successfully"; }
}