package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // một suất chiếu có nhiều vé
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String seatNumber;
    
    @Column(nullable = false)
    private LocalDateTime bookingTime = LocalDateTime.now();
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.RESERVED;
    
    public enum BookingStatus {
        RESERVED,
        CONFIRMED,
        CANCELLED
    }

    public Booking(Showtime showtime, User user, String seatNumber) {
        this.showtime = showtime;
        this.user = user;
        this.seatNumber = seatNumber;
    }

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public Showtime getShowtime() {return showtime;}
    public void setShowtime(Showtime showtime) {this.showtime = showtime;}

    public String getSeatNumber() {return seatNumber;}
    public void setSeatNumber(String seatNumber) {this.seatNumber = seatNumber;}
}
