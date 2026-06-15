package com.movie.rophim.Service;

import com.movie.rophim.DTO.WatchHistoryDTO;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.WatchHistory;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.MovieRepository;
import com.movie.rophim.Repository.UserRepository;
import com.movie.rophim.Repository.WatchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WatchHistoryService {

    private final WatchHistoryRepository watchHistoryRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    // thay method getMyHistory
    public Page<WatchHistoryDTO> getMyHistory(int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return watchHistoryRepository.findByUserOrderByLastWatchedDesc(user, pageable)
                .map(this::mapToDTO);
    }
    // Lấy lịch sử xem của user hiện tại
//    public List<WatchHistoryDTO> getMyHistory() {
//        User user = getCurrentUser();
//        return watchHistoryRepository.findByUserOrderByLastWatchedDesc(user)
//                .stream().map(this::mapToDTO).toList();
//    }


    // Cập nhật tiến độ xem (upsert)
    public WatchHistoryDTO updateProgress(Long movieId, Integer watchedTime) {
        User user = getCurrentUser();
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

        // Tăng totalViews nếu là lần đầu xem
        Optional<WatchHistory> existing = watchHistoryRepository.findByUserAndMovie(user, movie);
        WatchHistory history;

        if (existing.isPresent()) {
            history = existing.get();
            history.setWatchedTime(watchedTime);
            history.setLastWatched(LocalDateTime.now());
        } else {
            history = WatchHistory.builder()
                    .user(user).movie(movie)
                    .watchedTime(watchedTime)
                    .lastWatched(LocalDateTime.now())
                    .build();
            // tăng view
            movie.setTotalViews(movie.getTotalViews() == null ? 1L : movie.getTotalViews() + 1);
            movieRepository.save(movie);
        }

        return mapToDTO(watchHistoryRepository.save(history));
    }

    // Xóa 1 lịch sử
    public void deleteHistory(Long historyId) {
        User user = getCurrentUser();
        WatchHistory history = watchHistoryRepository.findById(historyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "History not found"));
        if (!history.getUser().getId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        watchHistoryRepository.delete(history);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private WatchHistoryDTO mapToDTO(WatchHistory h) {
        return WatchHistoryDTO.builder()
                .id(h.getId())
                .movieId(h.getMovie().getId())
                .movieTitle(h.getMovie().getTitle())
                .posterUrl(h.getMovie().getPosterUrl())
                .watchedTime(h.getWatchedTime())
                .lastWatched(h.getLastWatched())
                .build();
    }
}