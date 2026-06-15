package com.movie.rophim.Controller;

import com.movie.rophim.DTO.ActorDTO;
import com.movie.rophim.DTO.ActorRequestDTO;
import com.movie.rophim.Service.ActorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actors")
@RequiredArgsConstructor
public class ActorController {

    private final ActorService actorService;

    @GetMapping
    public List<ActorDTO> getAllActors() {
        return actorService.getAllActors();
    }

    @GetMapping("/search")
    public List<ActorDTO> searchActors(@RequestParam String keyword) {
        return actorService.searchActors(keyword);
    }

    @GetMapping("/{id}")
    public ActorDTO getActorById(@PathVariable Long id) {
        return actorService.getActorById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ActorDTO createActor(@RequestBody ActorRequestDTO request) {
        return actorService.createActor(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ActorDTO updateActor(@PathVariable Long id, @RequestBody ActorRequestDTO request) {
        return actorService.updateActor(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteActor(@PathVariable Long id) {
        actorService.deleteActor(id);
        return "Actor deleted successfully";
    }
}