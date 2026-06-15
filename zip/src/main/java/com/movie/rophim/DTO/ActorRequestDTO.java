package com.movie.rophim.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActorRequestDTO {
    private String name;
    private String avatarUrl;
    private String biography;
}