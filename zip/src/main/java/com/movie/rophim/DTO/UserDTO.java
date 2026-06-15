package com.movie.rophim.DTO;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Set<String> roles;
}
