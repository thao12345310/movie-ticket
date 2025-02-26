package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")

public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // một suất chiếu có nhiều vé
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @Column(nullable = false)
    private String seatNumber;

    public Booking() {}

    public Booking(Showtime showtime, String seatNumber) {
        this.showtime = showtime;
        this.seatNumber = seatNumber;
    }

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public Showtime getShowtime() {return showtime;}
    public void setShowtime(Showtime showtime) {this.showtime = showtime;}

    public String getSeatNumber() {return seatNumber;}
    public void setSeatNumber(String seatNumber) {this.seatNumber = seatNumber;}
}
