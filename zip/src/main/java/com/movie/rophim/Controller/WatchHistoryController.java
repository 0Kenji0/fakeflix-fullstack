package com.movie.rophim.Controller;

import com.movie.rophim.DTO.WatchHistoryDTO;
import com.movie.rophim.Service.WatchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class WatchHistoryController {

    private final WatchHistoryService watchHistoryService;

    @GetMapping
    public Page<WatchHistoryDTO> getMyHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return watchHistoryService.getMyHistory(page, size);
    }
    // Cập nhật tiến độ xem (gọi mỗi khi user xem đến giây thứ n)
    @PostMapping("/{movieId}")
    public WatchHistoryDTO updateProgress(
            @PathVariable Long movieId,
            @RequestParam Integer watchedTime) {
        return watchHistoryService.updateProgress(movieId, watchedTime);
    }

    // Xóa 1 lịch sử
    @DeleteMapping("/{historyId}")
    public String deleteHistory(@PathVariable Long historyId) {
        watchHistoryService.deleteHistory(historyId);
        return "History deleted";
    }
}