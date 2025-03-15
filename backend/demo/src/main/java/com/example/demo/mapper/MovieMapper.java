package com.example.demo.mapper;

import org.mapstruct.Mapper;

import com.example.demo.dto.MovieDTO;
import com.example.demo.entity.Movie;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    Movie toMovie(MovieDTO movieRequest);
}
