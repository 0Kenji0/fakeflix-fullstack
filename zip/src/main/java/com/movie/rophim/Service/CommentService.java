package com.movie.rophim.Service;

import com.movie.rophim.DTO.CommentDTO;
import com.movie.rophim.DTO.CommentRequestDTO;
import com.movie.rophim.Entity.Movie.Movie;
import com.movie.rophim.Entity.user.Comment;
import com.movie.rophim.Entity.user.User;
import com.movie.rophim.Repository.CommentRepository;
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

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

//    // Lấy tất cả comment của phim
//    public List<CommentDTO> getCommentsByMovie(Long movieId) {
//        Movie movie = getMovieOrThrow(movieId);
//        return commentRepository.findByMovie(movie)
//                .stream().map(this::mapToDTO).toList();
//    }

    // Thêm comment
    public CommentDTO addComment(Long movieId, CommentRequestDTO request) {
        User user = getCurrentUser();
        Movie movie = getMovieOrThrow(movieId);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .movie(movie)
                .createdAt(LocalDateTime.now())
                .build();

        return mapToDTO(commentRepository.save(comment));
    }

    // Xóa comment (chỉ chủ sở hữu hoặc ADMIN)
    public void deleteComment(Long commentId) {
        User user = getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));

        if (!comment.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        commentRepository.delete(comment);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Movie getMovieOrThrow(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
    }

    private CommentDTO mapToDTO(Comment c) {
        return CommentDTO.builder()
                .id(c.getId())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .movieId(c.getMovie().getId())
                .userId(c.getUser().getId())
                .username(c.getUser().getUsername())
                .build();
    }
    public Page<CommentDTO> getCommentsByMovie(Long movieId, int page, int size) {
        Movie movie = getMovieOrThrow(movieId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return commentRepository.findByMovie(movie, pageable).map(this::mapToDTO);
    }
}