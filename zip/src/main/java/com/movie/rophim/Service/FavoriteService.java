package com.movie.rophim.Service;

import com.movie.rophim.DTO.FavoriteDTO;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.user.Favorite;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.FavoriteRepository;
import com.movie.rophim.Repository.MovieRepository;
import com.movie.rophim.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

//    // Lấy danh sách yêu thích của user hiện tại
//    public List<FavoriteDTO> getMyFavorites() {
//        User user = getCurrentUser();
//        return favoriteRepository.findByUser(user)
//                .stream().map(this::mapToDTO).toList();
//    }

    // Toggle: nếu chưa có thì thêm, nếu có rồi thì xóa
    public String toggleFavorite(Long movieId) {
        User user = getCurrentUser();
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

        Optional<Favorite> existing = favoriteRepository.findByUserAndMovie(user, movie);

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return "Removed from favorites";
        } else {
            favoriteRepository.save(Favorite.builder()
                    .user(user).movie(movie)
                    .createdAt(LocalDateTime.now())
                    .build());
            return "Added to favorites";
        }
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private FavoriteDTO mapToDTO(Favorite f) {
        return FavoriteDTO.builder()
                .id(f.getId())
                .movieId(f.getMovie().getId())
                .movieTitle(f.getMovie().getTitle())
                .posterUrl(f.getMovie().getPosterUrl())
                .createdAt(f.getCreatedAt())
                .build();
    }
    // thay method getMyFavorites
    public Page<FavoriteDTO> getMyFavorites(int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return favoriteRepository.findByUser(user, pageable).map(this::mapToDTO);
    }
}
