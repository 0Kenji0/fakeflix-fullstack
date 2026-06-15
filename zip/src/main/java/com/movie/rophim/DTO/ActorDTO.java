package com.movie.rophim.DTO;

import lombok.*;

@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActorDTO {
    private Long id;
    private String name;
    private String avatarUrl;
    private String biography;
}