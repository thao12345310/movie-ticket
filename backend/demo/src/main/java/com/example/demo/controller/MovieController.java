package com.example.demo.controller;

import java.util.List;

// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Movie;
import com.example.demo.service.MovieService;

@RestController
@RequestMapping
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // lấy danh sách toàn bộ phim
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // lấy thông tin phim theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // // thêm phim mới
    // @PostMapping
    // public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
    //     Movie savedMovie = movieService.saveMovie(movie);
    //     return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    // }

    // // cập nhật phim
    // @PutMapping("/{id}")
    // public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movieDetails) {
    //     return movieService.updateMovie(id, movieDetails)
    //             .map(ResponseEntity::ok)
    //             .orElse(ResponseEntity.notFound().build());
    // }

    // // xóa phim
    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
    //     if (movieService.deleteMovie(id)) {
    //         return ResponseEntity.noContent().build();
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }
}
