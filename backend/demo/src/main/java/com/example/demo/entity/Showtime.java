package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "showtimes")
@Data
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne // một bộ phim có nhiều suất chiếu
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnoreProperties({"showtimes"}) // Chỉ bỏ qua trường showtimes trong Room để tránh vòng lặp vô hạn
    private Room room;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    private LocalDate date;

    @JsonIgnore
    @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    public Showtime() {}

    public Showtime (Movie movie, LocalDateTime startTime, LocalDateTime endTime) {
        this.movie = movie;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}
