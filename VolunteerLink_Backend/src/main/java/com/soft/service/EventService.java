package com.soft.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soft.dto.EventDto;
import com.soft.entity.Event;
import com.soft.entity.User;
import com.soft.enums.Role;
import com.soft.repository.EventRepository;
import com.soft.repository.UserRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EventDto createEvent(EventDto eventDto, Long adminId) {
        User admin = userRepository.findById(adminId).get();
        if (admin.getRole() != Role.ADMIN) {
            throw new SecurityException("User is not authorized to create events.");
        }

        Event event = new Event();
        event.setTitle(eventDto.getTitle());
        event.setDate(eventDto.getDate());
        event.setDescription(eventDto.getDescription());
        event.setLocation(eventDto.getLocation());
        event.setSalary(eventDto.getSalary());
        event.setOrganizerPhoneNumber(eventDto.getOrganizerPhoneNumber());
        event.setCreatedBy(admin);

        Event savedEvent = eventRepository.save(event);
    
        User creator = savedEvent.getCreatedBy();
        return new EventDto(
            savedEvent.getId(),
            savedEvent.getTitle(),
            savedEvent.getDate(),
            savedEvent.getDescription(),
            savedEvent.getLocation(),
            creator != null ? creator.getId() : null,
            creator != null ? creator.getFullName() : null,
            savedEvent.getSalary(),
            savedEvent.getOrganizerPhoneNumber()
        );
    }

    @Transactional
    public Optional<EventDto> updateEvent(Long eventId, EventDto eventDto, Long adminId) {
        Event event = eventRepository.findById(eventId).get();

        if (!event.getCreatedBy().getId().equals(adminId)) {
            throw new SecurityException("User not authorized to update this event.");
        }
        if (event.getCreatedBy().getRole() != Role.ADMIN) {
            throw new SecurityException("Event creator is not an admin.");
        }

        event.setTitle(eventDto.getTitle());
        event.setDate(eventDto.getDate());
        event.setDescription(eventDto.getDescription());
        event.setLocation(eventDto.getLocation());
        event.setSalary(eventDto.getSalary());
        event.setOrganizerPhoneNumber(eventDto.getOrganizerPhoneNumber());

        Event updatedEvent = eventRepository.save(event);
   
        User creator = updatedEvent.getCreatedBy();
        return Optional.of(new EventDto(
            updatedEvent.getId(),
            updatedEvent.getTitle(),
            updatedEvent.getDate(),
            updatedEvent.getDescription(),
            updatedEvent.getLocation(),
            creator != null ? creator.getId() : null,
            creator != null ? creator.getFullName() : null,
            updatedEvent.getSalary(),
            updatedEvent.getOrganizerPhoneNumber()
        ));
    }

    @Transactional
    public boolean deleteEvent(Long eventId, Long adminId) {
        Event event = eventRepository.findById(eventId).get();

        if (!event.getCreatedBy().getId().equals(adminId)) {
            throw new SecurityException("User not authorized to delete this event.");
        }
        if (event.getCreatedBy().getRole() != Role.ADMIN) {
            throw new SecurityException("Event creator is not an admin.");
        }

        eventRepository.deleteById(eventId);
        return true;
    }

    @Transactional(readOnly = true)
    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> {
                    User creator = event.getCreatedBy();
                    return new EventDto(
                        event.getId(),
                        event.getTitle(),
                        event.getDate(),
                        event.getDescription(),
                        event.getLocation(),
                        creator != null ? creator.getId() : null,
                        creator != null ? creator.getFullName() : null,
                        event.getSalary(),
                        event.getOrganizerPhoneNumber()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDateTime.now()).stream()
                .map(event -> {
                    User creator = event.getCreatedBy();
                    return new EventDto(
                        event.getId(),
                        event.getTitle(),
                        event.getDate(),
                        event.getDescription(),
                        event.getLocation(),
                        creator != null ? creator.getId() : null,
                        creator != null ? creator.getFullName() : null,
                        event.getSalary(),
                        event.getOrganizerPhoneNumber()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<EventDto> getEventById(Long eventId) {
        return eventRepository.findById(eventId).map(event -> {
            User creator = event.getCreatedBy();
            return new EventDto(
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getDescription(),
                event.getLocation(),
                creator != null ? creator.getId() : null,
                creator != null ? creator.getFullName() : null,
                event.getSalary(),
                event.getOrganizerPhoneNumber()
            );
        });
    }

    @Transactional(readOnly = true)
    public List<EventDto> getEventsCreatedByAdmin(Long adminId) {
        userRepository.findById(adminId)
            .filter(user -> user.getRole() == Role.ADMIN)
            .orElseThrow(() -> new SecurityException("User is not an admin or not found."));

        return eventRepository.findByCreatedById(adminId).stream()
                .map(event -> {
                    User creator = event.getCreatedBy();
                    return new EventDto(
                        event.getId(),
                        event.getTitle(),
                        event.getDate(),
                        event.getDescription(),
                        event.getLocation(),
                        creator != null ? creator.getId() : null,
                        creator != null ? creator.getFullName() : null,
                        event.getSalary(),
                        event.getOrganizerPhoneNumber()
                    );
                })
                .collect(Collectors.toList());
    }
    public List<EventDto> searchUpcomingEvents(String location, LocalDate eventDate) {
     
        String searchLocation = (location != null && !location.isBlank()) ? location : null;
      
        LocalDateTime now = LocalDateTime.now();

        List<Event> events = eventRepository.searchUpcomingEvents(now, searchLocation, eventDate);
        return events.stream()
                     .map(event -> new EventDto(
                             event.getId(),
                             event.getTitle(),
                             event.getDate(),
                             event.getDescription(),
                             event.getLocation(),
                             event.getCreatedBy().getId(),
                             event.getCreatedBy().getFullName(),
                             event.getSalary(),
                             event.getOrganizerPhoneNumber()
                     ))
                     .collect(Collectors.toList());
    }

}
