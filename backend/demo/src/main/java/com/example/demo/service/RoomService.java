package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Room;
import com.example.demo.repository.RoomRepository;

@Service
public class RoomService {
    
    private final RoomRepository roomRepository;
    
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }
    
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }
    
    public Optional<Room> updateRoom(String id, Room roomDetails) {
        return roomRepository.findById(id)
                .map(existingRoom -> {
                    existingRoom.setName(roomDetails.getName());
                    return roomRepository.save(existingRoom);
                });
    }
    
    public boolean deleteRoom(String id) {
        return roomRepository.findById(id)
                .map(room -> {
                    roomRepository.delete(room);
                    return true;
                })
                .orElse(false);
    }
} 