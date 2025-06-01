package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.BookingDTO;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Showtime;
import com.example.demo.entity.User;
import com.example.demo.service.UserDetailsImpl;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Booking createBooking(String showtimeId, String seatNumber) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy suất chiếu"));

        // Kiểm tra ghế đã được đặt chưa
        boolean isSeatBooked = bookingRepository.findByShowtimeAndSeatNumber(showtime, seatNumber)
                .isPresent();

        if (isSeatBooked) {
            throw new RuntimeException("Ghế này đã được đặt");
        }

        Booking booking = new Booking(showtime, user, seatNumber);
        return bookingRepository.save(booking);
    }

    public List<BookingDTO> getMyBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<Booking> bookings = bookingRepository.findByUser(user);
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setStartTime(booking.getShowtime().getStartTime());
        dto.setSeatNumber(booking.getSeatNumber());
        dto.setStatus(booking.getStatus().toString());
        dto.setMovieTitle(booking.getShowtime().getMovie().getTitle());
        dto.setMovieImage(booking.getShowtime().getMovie().getPosterUrl());
        return dto;
    }
    

    public Booking getBookingById(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt vé"));

        // Chỉ người dùng sở hữu hoặc admin mới có thể xem chi tiết
        if (!booking.getUser().getId().equals(userDetails.getId()) && 
                !authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Không có quyền truy cập");
        }

        return booking;
    }

    public List<Booking> getAllBookings() {
        // Phương thức này chỉ admin mới gọi được (sẽ có kiểm tra ở controller)
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt vé"));

        // Chỉ người dùng sở hữu hoặc admin mới có thể cập nhật
        if (!booking.getUser().getId().equals(userDetails.getId()) && 
                !authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Không có quyền truy cập");
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt vé"));

        // Chỉ người dùng sở hữu hoặc admin mới có thể hủy
        if (!booking.getUser().getId().equals(userDetails.getId()) && 
                !authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Không có quyền truy cập");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}
