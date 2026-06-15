package com.movie.rophim.Entity.user;

import com.movie.rophim.Entity.Base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Role extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
}