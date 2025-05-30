package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.ShowtimeService;
import com.example.demo.dto.ShowtimeDTO;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping
    public List<ShowtimeDTO> getAllShowtimes() {
        return showtimeService.getAllShowtimesAsDTO();
    }

    @GetMapping("/{id}")
    public ShowtimeDTO getShowtimeById(@PathVariable String id) {
        return showtimeService.getShowtimeById(id);
    }

    @GetMapping("/movie/{movieId}")
    public List<ShowtimeDTO> getShowtimesByMovieId(@PathVariable String movieId) {
        return showtimeService.getShowtimesByMovieId(movieId);
    }

    @PostMapping // xử lí POST request + @RequestBody giúp chuyển JSON thành object Java
    public ResponseEntity<ShowtimeDTO> addShowtime(@RequestBody ShowtimeDTO showtimeDTO) {
        ShowtimeDTO newShowtime = showtimeService.addShowtime(showtimeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newShowtime);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable String id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}
