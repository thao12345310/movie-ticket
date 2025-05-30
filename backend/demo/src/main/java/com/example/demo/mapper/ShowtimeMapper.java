package com.example.demo.mapper;

import org.mapstruct.Mapper;

import com.example.demo.entity.Showtime;

@Mapper(componentModel = "spring")
public interface ShowtimeMapper {
    Showtime toShowtime(Showtime showtimeRequest);
}
