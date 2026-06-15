package com.movie.rophim.Controller;

import com.movie.rophim.DTO.SubtitleDTO;
import com.movie.rophim.DTO.SubtitleRequestDTO;
import com.movie.rophim.Service.SubtitleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies/{movieId}/subtitles")
@RequiredArgsConstructor
public class SubtitleController {

    private final SubtitleService subtitleService;

    // Lấy tất cả subtitle của phim - public
    @GetMapping
    public List<SubtitleDTO> getSubtitles(@PathVariable Long movieId) {
        return subtitleService.getSubtitlesByMovie(movieId);
    }

    // Thêm subtitle - chỉ ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SubtitleDTO addSubtitle(
            @PathVariable Long movieId,
            @RequestBody SubtitleRequestDTO request) {
        return subtitleService.addSubtitle(movieId, request);
    }

    // Xóa subtitle - chỉ ADMIN
    @DeleteMapping("/{subtitleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteSubtitle(
            @PathVariable Long movieId,
            @PathVariable Long subtitleId) {
        subtitleService.deleteSubtitle(subtitleId);
        return "Subtitle deleted successfully";
    }
}