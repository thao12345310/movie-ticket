package com.example.demo.entity;

import jakarta.persistence.*; // tiêu chuẩn JPA mà các thư viện như Hibernate triển khai để thao tác với cơ sở dữ liệu mà không cần viết SQL thủ công

@Entity // đánh dấu đây là entity
@Table(name = "movies") // ánh xạ với bảng movies trong database

public class Movie {

    @Id // định nghĩa cột primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // tự động tăng ID (auto-increment)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int duration;

    public Movie() {}

    public Movie(String title, String description, int duration) {
        this.title = title;
        this.description = description;
        this.duration = duration;
    }

    //Getter và Setter (dùng để truy suất dữ liệu)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}
