package com.example.demo.entity;

import jakarta.persistence.*; // tiêu chuẩn JPA mà các thư viện như Hibernate triển khai để thao tác với cơ sở dữ liệu mà không cần viết SQL thủ công
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity // đánh dấu đây là entity
@Table(name = "movies") // ánh xạ với bảng movies trong database
@Data
public class Movie {

    @Id // định nghĩa cột primary key
    @GeneratedValue(strategy = GenerationType.UUID) 
    private String id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int duration;

    @Column(nullable = true, length = 500) // Lưu URL của poster
    private String posterUrl;

    private String genre;

    public Movie() {}

    public Movie(String title, String description, int duration, String posterUrl) {
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.posterUrl = posterUrl;
    }
}
