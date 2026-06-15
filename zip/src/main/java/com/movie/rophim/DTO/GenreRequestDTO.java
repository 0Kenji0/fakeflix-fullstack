package com.movie.rophim.DTO;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GenreRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;
}