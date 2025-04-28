package com.soft.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soft.dto.SignupDto.SignupRequestDto;
import com.soft.dto.SignupDto.SignupResponseDto;
import com.soft.dto.SignupDto.VolunteerCancellationDto;
import com.soft.dto.UserDto;
import com.soft.service.SignupService;
import com.soft.service.UserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/volunteer")
public class VolunteerController {

    @Autowired
    private SignupService signupService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> applyForEvent(@RequestBody SignupRequestDto signupRequest) {
        if (signupRequest.getUserId() == null) {
            return ResponseEntity.badRequest().body("User ID is required in request.");
        }
        SignupResponseDto response = signupService.applyForEvent(signupRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/signup/{signupId}/cancel")
    public ResponseEntity<?> cancelMySignup(
        @PathVariable Long signupId,
        @RequestParam Long volunteerUserId,
        @RequestBody VolunteerCancellationDto cancellationDto) {
        SignupResponseDto response = signupService.cancelSignupByVolunteer(signupId, volunteerUserId, cancellationDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-events/{userId}")
    public ResponseEntity<?> getMyEvents(@PathVariable Long userId) {
        List<SignupResponseDto> signups = signupService.getSignupsForUser(userId);
        return ResponseEntity.ok(signups);
    }
    @CrossOrigin
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateProfile(
        @PathVariable Long userId,
        @RequestBody UserDto.UserProfileUpdateDto updateDto) {
        userService.updateUserProfile(userId, updateDto);
        
        Optional<UserDto.UserProfileResponseDto> profileDto = userService.getUserProfileDetails(userId);
        if (profileDto.isPresent()) {
            return ResponseEntity.ok(profileDto.get());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Profile updated but failed to refetch.");
        }
    }
    @GetMapping("/signup/{signupId}")
    public ResponseEntity<?> getSignupById(@PathVariable Long signupId) {
        Optional<SignupResponseDto> signupResponse = signupService.getSignupById(signupId);
        if (signupResponse.isPresent()) {
            return ResponseEntity.ok(signupResponse.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Signup not found for ID: " + signupId);
        }
    }

}
