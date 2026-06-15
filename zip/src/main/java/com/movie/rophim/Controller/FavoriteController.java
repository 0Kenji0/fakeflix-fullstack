package com.movie.rophim.Controller;

import com.movie.rophim.DTO.FavoriteDTO;
import com.movie.rophim.Service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;



    // Toggle yêu thích (thêm hoặc xóa)
    @PostMapping("/{movieId}/toggle")
    public String toggleFavorite(@PathVariable Long movieId) {
        return favoriteService.toggleFavorite(movieId);
    }
    @GetMapping
    public Page<FavoriteDTO> getMyFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return favoriteService.getMyFavorites(page, size);
    }
}