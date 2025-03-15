package com.example.demo.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.repository.MovieRepository;
import com.example.demo.dto.MovieDTO;
import com.example.demo.entity.Movie;

@Service
public class MovieService {
    private final MovieRepository movieRepository; // giúp Service kết nối với Repo để gọi các phương thức như findAll()

    // contructor injection
    public MovieService(MovieRepository movieRepository) { 
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public boolean deleteMovie(String id) {
        Optional<Movie> movie = movieRepository.findById(id);
        if(movie.isPresent()) {
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
