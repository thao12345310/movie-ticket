package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.dto.ShowtimeDTO;
import com.example.demo.entity.Movie;
import com.example.demo.entity.Showtime;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.ShowtimeRepository;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;

    public ShowtimeService(ShowtimeRepository showtimeRepository, MovieRepository movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }

    public List<ShowtimeDTO> getAllShowtimes() {
        return showtimeRepository.findAll()
            .stream()
            .map(ShowtimeDTO::new)
            .collect(Collectors.toList());
    }

    public Showtime saveShowtime(Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

    public Showtime addShowtime(ShowtimeDTO showtimeDTO) {
        Movie movie = movieRepository.findById(showtimeDTO.getMovieId())
            .orElseThrow(() -> new RuntimeException("Movie not found"));

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setStartTime(showtimeDTO.getStartTime());
        showtime.setEndTime(showtimeDTO.getEndTime());

        return showtimeRepository.save(showtime);
    }

    public List<Showtime> getUpcomingShowtimes() {
        return showtimeRepository.findByStartTimeAfter(LocalDateTime.now());
    }
}
