package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Showtime;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, String> {
    List<Showtime> findByStartTimeAfter(LocalDateTime now);
    
    // Sử dụng quy ước đặt tên phương thức của Spring Data JPA
    List<Showtime> findByMovie_Id(String movieId);
    
    // Tìm tất cả lịch chiếu trong một phòng
    List<Showtime> findByRoom_Id(String roomId);
}
