package com.movie.rophim.Controller;

import com.movie.rophim.DTO.CommentDTO;
import com.movie.rophim.DTO.CommentRequestDTO;
import com.movie.rophim.Service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies/{movieId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;



    // POST comment - cần đăng nhập
    @PostMapping
    public CommentDTO addComment(@PathVariable Long movieId, @Valid @RequestBody CommentRequestDTO request) {
        return commentService.addComment(movieId, request);
    }

    // DELETE comment - chủ sở hữu hoặc ADMIN
    @DeleteMapping("/{commentId}")
    public String deleteComment(@PathVariable Long movieId, @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return "Comment deleted";
    }
    @GetMapping
    public Page<CommentDTO> getComments(
            @PathVariable Long movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return commentService.getCommentsByMovie(movieId, page, size);
    }

}