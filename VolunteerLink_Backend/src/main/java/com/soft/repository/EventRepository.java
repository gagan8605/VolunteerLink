package com.soft.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.soft.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDateAfter(LocalDateTime date);
    List<Event> findByCreatedById(Long adminId);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.createdBy cb " +
           "WHERE e.date >= :currentDateTime " +
           "AND (:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:eventDate IS NULL OR DATE(e.date) = :eventDate) " +
           "ORDER BY e.date ASC")
    List<Event> searchUpcomingEvents(
            @Param("currentDateTime") LocalDateTime currentDateTime,
            @Param("location") String location,
            @Param("eventDate") LocalDate eventDate);
}