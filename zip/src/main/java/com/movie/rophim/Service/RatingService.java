package com.movie.rophim.Service;

import com.movie.rophim.DTO.RatingDTO;
import com.movie.rophim.DTO.RatingRequestDTO;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.Movie.MovieRating;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.MovieRatingRepository;
import com.movie.rophim.Repository.MovieRepository;
import com.movie.rophim.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final MovieRatingRepository ratingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    // Rate phim (upsert) + tự cập nhật averageRating
    public RatingDTO rateMovie(Long movieId, RatingRequestDTO request) {
        if (request.getStars() < 1 || request.getStars() > 5)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stars must be between 1 and 5");

        User user = getCurrentUser();
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

        Optional<MovieRating> existing = ratingRepository.findByUserAndMovie(user, movie);
        MovieRating rating;

        if (existing.isPresent()) {
            rating = existing.get();
            rating.setStars(request.getStars());
        } else {
            rating = MovieRating.builder()
                    .user(user).movie(movie)
                    .stars(request.getStars())
                    .build();
        }

        ratingRepository.save(rating);
        recalculateAverage(movie);

        return mapToDTO(rating);
    }

    // Lấy rating của user hiện tại cho phim
    public RatingDTO getMyRating(Long movieId) {
        User user = getCurrentUser();
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
        MovieRating rating = ratingRepository.findByUserAndMovie(user, movie)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));
        return mapToDTO(rating);
    }

    // Tính lại averageRating của phim
    private void recalculateAverage(Movie movie) {
        List<MovieRating> ratings = ratingRepository.findByMovie(movie);
        double avg = ratings.stream()
                .mapToInt(MovieRating::getStars)
                .average().orElse(0.0);
        movie.setAverageRating(Math.round(avg * 10.0) / 10.0);
        movieRepository.save(movie);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private RatingDTO mapToDTO(MovieRating r) {
        return RatingDTO.builder()
                .id(r.getId()).stars(r.getStars())
                .movieId(r.getMovie().getId())
                .userId(r.getUser().getId())
                .build();
    }
}