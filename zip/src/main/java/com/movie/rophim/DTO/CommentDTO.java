package com.movie.rophim.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long movieId;
    private Long userId;
    private String username;
}