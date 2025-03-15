package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieDTO {
        private String title;
        private String description;
        private int duration;
        private String posterUrl;
        private String genre;

}
