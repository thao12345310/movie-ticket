package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.type.descriptor.jdbc.LongVarbinaryJdbcType;
import org.springframework.cglib.core.Local;

@Entity
@Table(name = "showtimes")
@Data
public class Showtime {
    @Id@GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne // một bộ phim có nhiều suất chiếu
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    public Showtime() {}

    public Showtime (Movie movie, LocalDateTime startTime, LocalDateTime endTime) {
        this.movie = movie;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}
