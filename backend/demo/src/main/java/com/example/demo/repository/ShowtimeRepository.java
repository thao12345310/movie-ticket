package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Showtime;

@Repository
public interface ShowtimeRepository  extends JpaRepository<Showtime, Long>{
    List<Showtime> findByStartTimeAfter(LocalDateTime now);
}
