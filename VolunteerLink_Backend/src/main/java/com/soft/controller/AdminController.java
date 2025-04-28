package com.soft.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soft.dto.EventDto;
import com.soft.dto.SignupDto.AdminSignupUpdateDto;
import com.soft.dto.SignupDto.SignupResponseDto;
import com.soft.dto.UserDto;
import com.soft.service.EventService;
import com.soft.service.SignupService;
import com.soft.service.UserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EventService eventService;
    @Autowired
    private SignupService signupService;
    @Autowired
    private UserService userService;

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@RequestBody EventDto eventDto,
                                         @RequestParam Long adminId) {
        EventDto createdEvent = eventService.createEvent(eventDto, adminId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/events/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId,
                                         @RequestBody EventDto eventDto,
                                         @RequestParam Long adminId) {
        Optional<EventDto> updatedEvent = eventService.updateEvent(eventId, eventDto, adminId);
        if (updatedEvent.isPresent()) {
            return ResponseEntity.ok(updatedEvent.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId,
                                            @RequestParam Long adminId) {
        eventService.deleteEvent(eventId, adminId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-events/{adminId}")
    public ResponseEntity<?> getAdminEvents(@PathVariable Long adminId) {
        List<EventDto> events = eventService.getEventsCreatedByAdmin(adminId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/events/{eventId}/volunteers")
    public ResponseEntity<?> getVolunteersForEvent(@PathVariable Long eventId) {
        List<SignupResponseDto> signups = signupService.getSignupsForEvent(eventId);
        return ResponseEntity.ok(signups);
    }

    @PutMapping("/signups/{signupId}/manage")
    public ResponseEntity<?> manageSignupStatus(@PathVariable Long signupId,
                                                @RequestParam Long adminId,
                                                @RequestBody AdminSignupUpdateDto updateDto) {
        SignupResponseDto response = signupService.manageSignupByAdmin(signupId, adminId, updateDto);
        return ResponseEntity.ok(response);
    }
    @CrossOrigin
    @GetMapping("/volunteers/{volunteerId}/profile")
    public ResponseEntity<?> getVolunteerProfile(@PathVariable Long volunteerId) {
        Optional<UserDto.UserProfileResponseDto> profileDto = userService.getUserProfileDetails(volunteerId);
        if (profileDto.isPresent()) {
            return ResponseEntity.ok(profileDto.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @GetMapping("/reports/event/{eventId}/csv")
    public ResponseEntity<String> downloadEventReport(@PathVariable Long eventId) {
        String csvData = signupService.generateEventParticipationReport(eventId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "event_" + eventId + "_participation.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

}
