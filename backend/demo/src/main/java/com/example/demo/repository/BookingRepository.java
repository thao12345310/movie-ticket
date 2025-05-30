package com.example.demo.repository;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Showtime;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    
    Optional<Booking> findByShowtimeAndSeatNumber(Showtime showtime, String seatNumber);
    
    List<Booking> findByShowtime(Showtime showtime);
}
