package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.dto.ShowtimeDTO;
import com.example.demo.entity.Movie;
import com.example.demo.entity.Room;
import com.example.demo.entity.Showtime;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.ShowtimeRepository;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    public ShowtimeService(ShowtimeRepository showtimeRepository, 
                          MovieRepository movieRepository,
                          RoomRepository roomRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.roomRepository = roomRepository;
    }

    public List<ShowtimeDTO> getAllShowtimesAsDTO() {
        return showtimeRepository.findAll()
            .stream()
            .map(ShowtimeDTO::new)
            .collect(Collectors.toList());
    }

    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    public Showtime saveShowtime(Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

    public ShowtimeDTO addShowtime(ShowtimeDTO showtimeDTO) {
        Movie movie = movieRepository.findById(showtimeDTO.getMovieId())
            .orElseThrow(() -> new RuntimeException("Movie not found"));
            
        Room room = roomRepository.findById(showtimeDTO.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found"));

        if (hasTimeConflict(null, showtimeDTO.getRoomId(), showtimeDTO.getStartTime(), showtimeDTO.getEndTime())) {
            throw new RuntimeException("Phòng đã được đặt trong khung giờ này. Vui lòng chọn khung giờ khác.");
        }

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(showtimeDTO.getStartTime());
        showtime.setEndTime(showtimeDTO.getEndTime());
        showtime.setDate(showtimeDTO.getDate());

        Showtime savedShowtime = showtimeRepository.save(showtime);
        return new ShowtimeDTO(savedShowtime);
    }

    public ShowtimeDTO updateShowtime(String id, ShowtimeDTO showtimeDTO) {
        Showtime showtime = showtimeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Showtime not found"));
            
        Movie movie = movieRepository.findById(showtimeDTO.getMovieId())
            .orElseThrow(() -> new RuntimeException("Movie not found"));
            
        Room room = roomRepository.findById(showtimeDTO.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found"));

        if (hasTimeConflict(id, showtimeDTO.getRoomId(), showtimeDTO.getStartTime(), showtimeDTO.getEndTime())) {
            throw new RuntimeException("Phòng đã được đặt trong khung giờ này. Vui lòng chọn khung giờ khác.");
        }

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(showtimeDTO.getStartTime());
        showtime.setEndTime(showtimeDTO.getEndTime());
        showtime.setDate(showtimeDTO.getDate());

        Showtime updatedShowtime = showtimeRepository.save(showtime);
        return new ShowtimeDTO(updatedShowtime);
    }

    private boolean hasTimeConflict(String id, String roomId, LocalDateTime startTime, LocalDateTime endTime) {
            List<Showtime> roomShowtimes = showtimeRepository.findByRoom_Id(roomId);
            
            return roomShowtimes.stream()
                .filter(showtime -> id == null || !showtime.getId().equals(id))
            .anyMatch(showtime -> {
                LocalDateTime existingStart = showtime.getStartTime();
                LocalDateTime existingEnd = showtime.getEndTime();
                
                return (startTime.isEqual(existingStart) || startTime.isAfter(existingStart)) && startTime.isBefore(existingEnd) ||
                       endTime.isAfter(existingStart) && (endTime.isEqual(existingEnd) || endTime.isBefore(existingEnd)) ||
                       (startTime.isEqual(existingStart) || startTime.isBefore(existingStart)) && (endTime.isEqual(existingEnd) || endTime.isAfter(existingEnd));
            });
    }

    public List<Showtime> getUpcomingShowtimes() {
        return showtimeRepository.findByStartTimeAfter(LocalDateTime.now());
    }
    
    public List<ShowtimeDTO> getShowtimesByMovieId(String movieId) {
        return showtimeRepository.findByMovie_Id(movieId)
            .stream()
            .map(ShowtimeDTO::new)
            .collect(Collectors.toList());
    }

    public void deleteShowtime(String id) {
        showtimeRepository.deleteById(id);
    }

    public ShowtimeDTO getShowtimeById(String id) {
        Showtime showtime = showtimeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Showtime not found"));
        return new ShowtimeDTO(showtime);
    }
}
