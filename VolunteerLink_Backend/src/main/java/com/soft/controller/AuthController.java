package com.soft.controller;

import com.soft.dto.AuthDtos.*;
import com.soft.entity.User;
import com.soft.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequestDto registrationRequest) {
        User newUser = userService.registerUser(registrationRequest);
        LoginResponse response = new LoginResponse(
            newUser.getId(),
            newUser.getFullName(),
            newUser.getRole(),
            "Registration successful. Please login."
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.loginUser(loginRequest);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            LoginResponse response = new LoginResponse(
                user.getId(), user.getFullName(), user.getRole(), "Login successful"
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }
    }
}
