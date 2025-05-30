package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.entity.Showtime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ShowtimeDTO {
    private String id;
    private String movieId;  // Chỉ lấy ID của movie
    private String roomId;   // Chỉ lấy ID của room
    private String movieTitle; // Tên phim
    private String posterUrl; // Poster của phim
    private String roomName; // Tên phòng
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDate date;

    // Constructor nhận entity Showtime
    public ShowtimeDTO(Showtime showtime) {
        this.id = showtime.getId();
        this.startTime = showtime.getStartTime();
        this.endTime = showtime.getEndTime();
        this.date = showtime.getDate();

        // Gán movieId và thông tin phim nếu movie không null
        if (showtime.getMovie() != null) {
            this.movieId = showtime.getMovie().getId();
            this.movieTitle = showtime.getMovie().getTitle();
            this.posterUrl = showtime.getMovie().getPosterUrl();
        }

        // Gán roomId và tên phòng nếu room không null
        if (showtime.getRoom() != null) {
            this.roomId = showtime.getRoom().getId();
            this.roomName = showtime.getRoom().getName();
        }
    }
}
