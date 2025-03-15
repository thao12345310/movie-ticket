package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.ShowtimeService;
import com.example.demo.dto.ShowtimeDTO;
import com.example.demo.entity.Showtime;

@RestController
@RequestMapping("/showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping
    public List<ShowtimeDTO> getAllShowtimes() {
        return showtimeService.getAllShowtimes();
    }

    @PostMapping // xử lí POST request + @RequestBody giúp chuyển JSON thành object Java
    public ResponseEntity<Showtime> addShowtime(@RequestBody ShowtimeDTO showtimeDTO) {
        Showtime newShowtime = showtimeService.addShowtime(showtimeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newShowtime);
    }
}
