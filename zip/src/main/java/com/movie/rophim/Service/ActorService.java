package com.movie.rophim.Service;

import com.movie.rophim.DTO.ActorDTO;
import com.movie.rophim.DTO.ActorRequestDTO;
import com.movie.rophim.Entity.Movie.Actor;
import com.movie.rophim.Repository.ActorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActorService {

    private final ActorRepository actorRepository;

    public List<ActorDTO> getAllActors() {
        return actorRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    public List<ActorDTO> searchActors(String keyword) {
        return actorRepository.findByNameContainingIgnoreCase(keyword)
                .stream().map(this::mapToDTO).toList();
    }

    public ActorDTO getActorById(Long id) {
        return mapToDTO(actorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor not found")));
    }

    public ActorDTO createActor(ActorRequestDTO request) {

        Actor actor = Actor.builder()
                .name(request.getName())
                .avatarUrl(request.getAvatarUrl())
                .biography(request.getBiography())
                .build();
        return mapToDTO(actorRepository.save(actor));
    }

    public ActorDTO updateActor(Long id, ActorRequestDTO request) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor not found"));
        actor.setName(request.getName());
        actor.setAvatarUrl(request.getAvatarUrl());
        actor.setBiography(request.getBiography());
        return mapToDTO(actorRepository.save(actor));
    }

    public void deleteActor(Long id) {
        actorRepository.delete(actorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor not found")));
    }

    private ActorDTO mapToDTO(Actor a) {
        return ActorDTO.builder()
                .id(a.getId()).name(a.getName())
                .avatarUrl(a.getAvatarUrl()).biography(a.getBiography())
                .build();
    }
}