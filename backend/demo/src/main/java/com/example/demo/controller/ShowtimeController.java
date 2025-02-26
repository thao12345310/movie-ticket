package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.ShowtimeService;
import com.example.demo.entity.Showtime;;

@RestController
@RequestMapping("/showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping
    public List<Showtime> getAllShowtimes() {
        return showtimeService.getAllShowtimes();
    }

    @PostMapping // xử lí POST request + @RequestBody giúp chuyển JSON thành object Java
    public Showtime addShowtime(@RequestBody Showtime showtime) {
        return showtimeService.saveShowtime(showtime);
    }

    @GetMapping("/upcoming")
    public List<Showtime> getUpcomingShowtimes() {
        return showtimeService.getUpcomingShowtimes();
    }
}
