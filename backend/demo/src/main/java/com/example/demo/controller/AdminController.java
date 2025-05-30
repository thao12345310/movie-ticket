package com.example.demo.controller;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserMapper userMapper;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDTOs);
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + id));
        
        return ResponseEntity.ok(userMapper.toDto(user));
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("Xóa người dùng thành công");
    }
    
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody Set<String> roles) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + id));
        
        Set<User.Role> userRoles = new HashSet<>();
        
        if (roles != null && !roles.isEmpty()) {
            roles.forEach(role -> {
                if ("admin".equalsIgnoreCase(role)) {
                    userRoles.add(User.Role.ROLE_ADMIN);
                } else {
                    userRoles.add(User.Role.ROLE_USER);
                }
            });
        } else {
            userRoles.add(User.Role.ROLE_USER);
        }
        
        user.setRoles(userRoles);
        userRepository.save(user);
        
        return ResponseEntity.ok(userMapper.toDto(user));
    }
    
    @PutMapping("/users/{id}/add-admin")
    public ResponseEntity<?> addAdminRole(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + id));
        
        Set<User.Role> userRoles = user.getRoles();
        userRoles.add(User.Role.ROLE_ADMIN);
        
        user.setRoles(userRoles);
        userRepository.save(user);
        
        return ResponseEntity.ok(userMapper.toDto(user));
    }
    
    // Thêm các chức năng quản trị khác nếu cần
} 