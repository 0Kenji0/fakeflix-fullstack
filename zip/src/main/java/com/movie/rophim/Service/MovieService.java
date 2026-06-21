package com.movie.rophim.Service;

import com.movie.rophim.DTO.ActorDTO;
import com.movie.rophim.DTO.GenreDTO;
import com.movie.rophim.DTO.MovieDTO;
import com.movie.rophim.DTO.MovieRequestDTO;
import com.movie.rophim.Entity.Movie.*;
import com.movie.rophim.Repository.ActorRepository;
import com.movie.rophim.Repository.GenreRepository;
import com.movie.rophim.Repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

import static com.movie.rophim.Repository.MovieSpecification.*;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ActorRepository actorRepository;
    @CacheEvict(value = {"featured", "topRated", "mostViewed", "movieById", "allMovies"}, allEntries = true)
    public MovieDTO createMovie(MovieRequestDTO request) {
        Movie movie = Movie.builder()
                .title(request.getTitle()).description(request.getDescription())
                .posterUrl(request.getPosterUrl()).bannerUrl(request.getBannerUrl())
                .trailerUrl(request.getTrailerUrl()).videoUrl(request.getVideoUrl())
                .releaseYear(request.getReleaseYear()).duration(request.getDuration())
                .country(request.getCountry()).language(request.getLanguage())
                .ageRating(request.getAgeRating()).director(request.getDirector())
                .cast(request.getCast()).totalEpisodes(request.getTotalEpisodes())
                .featured(request.getFeatured()).slug(request.getSlug())
                .status(request.getStatus()).type(request.getType())
                .genres(resolveGenres(request.getGenreIds()))
                .actors(resolveActors(request.getActorIds(), request.getCast()))
                .build();
        return mapToDTO(movieRepository.save(movie));
    }
    @Cacheable("allMovies")
    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll().stream().map(this::mapToDTO).toList();
    }
    @Cacheable(value = "movieById", key = "#id")
    public MovieDTO getMovieById(Long id) {
        return mapToDTO(movieRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found")));
    }
    @CacheEvict(value = {"featured", "topRated", "mostViewed", "movieById", "allMovies"}, allEntries = true)
    public MovieDTO updateMovie(Long id, MovieRequestDTO request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setBannerUrl(request.getBannerUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setVideoUrl(request.getVideoUrl());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDuration(request.getDuration());
        movie.setCountry(request.getCountry());
        movie.setLanguage(request.getLanguage());
        movie.setAgeRating(request.getAgeRating());
        movie.setDirector(request.getDirector());
        movie.setCast(request.getCast());
        movie.setTotalEpisodes(request.getTotalEpisodes());
        movie.setFeatured(request.getFeatured());
        movie.setSlug(request.getSlug());
        movie.setStatus(request.getStatus());
        movie.setType(request.getType());
        movie.setGenres(resolveGenres(request.getGenreIds()));
        movie.setActors(resolveActors(request.getActorIds(), request.getCast()));
        return mapToDTO(movieRepository.save(movie));
    }
    @CacheEvict(value = {"featured", "topRated", "mostViewed", "movieById", "allMovies"}, allEntries = true)
    public void deleteMovie(Long id) {
        movieRepository.delete(movieRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found")));
    }

    private Set<Genre> resolveGenres(Set<Long> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) return new HashSet<>();
        return new HashSet<>(genreRepository.findAllById(genreIds));
    }

    /**
     * Resolve actors từ actorIds hoặc tự động tạo từ cast string (tên diễn viên).
     * Ưu tiên actorIds nếu có, nếu không thì parse cast string và find-or-create.
     */
    private Set<Actor> resolveActors(Set<Long> actorIds, String cast) {
        // Nếu có actorIds thì dùng trực tiếp
        if (actorIds != null && !actorIds.isEmpty()) {
            return new HashSet<>(actorRepository.findAllById(actorIds));
        }
        // Nếu có cast string thì parse và find-or-create
        if (cast != null && !cast.isBlank()) {
            Set<Actor> actors = new HashSet<>();
            String[] names = cast.split(",");
            for (String rawName : names) {
                String name = rawName.trim();
                if (name.isEmpty()) continue;
                // Tìm actor theo tên, nếu không có thì tạo mới
                Actor actor = actorRepository.findByNameIgnoreCase(name)
                        .orElseGet(() -> actorRepository.save(
                                Actor.builder().name(name).build()
                        ));
                actors.add(actor);
            }
            return actors;
        }
        return new HashSet<>();
    }

    private MovieDTO mapToDTO(Movie movie) {
        Set<GenreDTO> genreDTOs = movie.getGenres() == null ? new HashSet<>() :
                movie.getGenres().stream()
                        .map(g -> GenreDTO.builder().id(g.getId()).name(g.getName()).build())
                        .collect(Collectors.toSet());

        Set<ActorDTO> actorDTOs = movie.getActors() == null ? new HashSet<>() :
                movie.getActors().stream()
                        .map(a -> ActorDTO.builder()
                                .id(a.getId())
                                .name(a.getName())
                                .avatarUrl(a.getAvatarUrl())
                                .biography(a.getBiography())
                                .build())
                        .collect(Collectors.toSet());

        return MovieDTO.builder()
                .id(movie.getId()).title(movie.getTitle()).description(movie.getDescription())
                .posterUrl(movie.getPosterUrl()).bannerUrl(movie.getBannerUrl())
                .trailerUrl(movie.getTrailerUrl()).videoUrl(movie.getVideoUrl())
                .releaseYear(movie.getReleaseYear()).duration(movie.getDuration())
                .country(movie.getCountry()).language(movie.getLanguage())
                .ageRating(movie.getAgeRating()).director(movie.getDirector())
                .cast(movie.getCast()).totalEpisodes(movie.getTotalEpisodes())
                .averageRating(movie.getAverageRating()).totalViews(movie.getTotalViews())
                .featured(movie.getFeatured()).slug(movie.getSlug())
                .status(movie.getStatus()).type(movie.getType())
                .genres(genreDTOs)
                .actors(actorDTOs)
                .build();
    }

    public Page<MovieDTO> searchMovies(
            String keyword, MovieStatus status, MovieType type,
            String country, Integer releaseYear, Long genreId, int page, int size) {
        Specification<Movie> spec = Specification
                .where(hasKeyword(keyword)).and(hasStatus(status))
                .and(hasType(type)).and(hasCountry(country))
                .and(hasReleaseYear(releaseYear)).and(hasGenreId(genreId));
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return movieRepository.findAll(spec, pageable).map(this::mapToDTO);
    }
    @Cacheable("featured")
    public List<MovieDTO> getFeaturedMovies() {
        return movieRepository.findByFeaturedTrue().stream().map(this::mapToDTO).toList();
    }
    @Cacheable("topRated")

    public List<MovieDTO> getTopRated() {
        return movieRepository.findTop10ByOrderByAverageRatingDesc().stream().map(this::mapToDTO).toList();
    }
    @Cacheable("mostViewed")
    public List<MovieDTO> getMostViewed() {
        return movieRepository.findTop10ByOrderByTotalViewsDesc().stream().map(this::mapToDTO).toList();
    }
}