package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.entity.Showtime;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ShowtimeDTO {
    private String id;
    private String movieId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @JsonCreator
    public ShowtimeDTO(
        @JsonProperty("id") String id,
        @JsonProperty("movieId") String movieId,
        @JsonProperty("startTime") LocalDateTime startTime,
        @JsonProperty("endTime") LocalDateTime endTime) {
        this.id = id;
        this.movieId = movieId;
        this.startTime = startTime;
        this.endTime = endTime;
    }


    public ShowtimeDTO(Showtime showtime) {
        this.id = showtime.getId();
        this.startTime = showtime.getStartTime();
        this.endTime = showtime.getEndTime();
    }

    // Getters & Setters
    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
