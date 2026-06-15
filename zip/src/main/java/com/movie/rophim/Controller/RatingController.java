package com.movie.rophim.Controller;

import com.movie.rophim.DTO.RatingDTO;
import com.movie.rophim.DTO.RatingRequestDTO;
import com.movie.rophim.Service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies/{movieId}/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // Rate phim (1-5 sao) - tự động upsert
    @PostMapping
    public RatingDTO rateMovie(@PathVariable Long movieId, @Valid @RequestBody RatingRequestDTO request) {
        return ratingService.rateMovie(movieId, request);
    }

    // Lấy rating
    @GetMapping("/me")
    public RatingDTO getMyRating(@PathVariable Long movieId) {
        return ratingService.getMyRating(movieId);
    }
}