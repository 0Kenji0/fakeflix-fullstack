package com.movie.rophim.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommentRequestDTO {

    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String content;
}