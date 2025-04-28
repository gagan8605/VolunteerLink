package com.soft.controller;

import com.soft.dto.UserDto;
import com.soft.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
     
    @CrossOrigin
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        Optional<UserDto.UserProfileResponseDto> profileDto = userService.getUserProfileDetails(userId);
        if (profileDto.isPresent()) {
            return ResponseEntity.ok(profileDto.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
