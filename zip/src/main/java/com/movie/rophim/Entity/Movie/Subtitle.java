package com.movie.rophim.Entity.Movie;

import com.movie.rophim.Entity.Base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subtitles")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Subtitle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String language;

    private String subtitleUrl;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
}
