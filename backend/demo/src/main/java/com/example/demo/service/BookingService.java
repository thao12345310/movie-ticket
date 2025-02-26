package com.example.demo.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.repository.BookingRepository;
import com.example.demo.entity.Booking;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;

    // constructor để inject BookingRepository vào Service 
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
}
