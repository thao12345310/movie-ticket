package com.example.demo.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;        // Tên phòng (VD: Phòng 1, Phòng 2...)
    
    // Mặc định tất cả các phòng đều có cùng layout
    // Số hàng và số cột được cố định cho tất cả các phòng
    public static final int ROW_COUNT = 11;     // Hàng từ A-K (11 hàng)
    public static final int COLUMN_COUNT = 12;  // 12 ghế mỗi hàng
    
    // Mặc định tất cả các phòng đều thuộc cùng một rạp và cùng loại
    public static final String ROOM_TYPE = "2D";

    @JsonIgnore
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<Showtime> showtimes;
}
