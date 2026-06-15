package com.movie.rophim.Entity.Movie;

import com.movie.rophim.Entity.Base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "actors")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Actor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String biography;
}