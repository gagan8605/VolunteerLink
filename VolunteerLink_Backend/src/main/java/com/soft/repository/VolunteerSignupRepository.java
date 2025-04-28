package com.soft.repository;

import com.soft.entity.VolunteerSignup;
import com.soft.enums.SignupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VolunteerSignupRepository extends JpaRepository<VolunteerSignup, Long> {
    Optional<VolunteerSignup> findByUserIdAndEventId(Long userId, Long eventId);
    List<VolunteerSignup> findByUserId(Long userId);
    List<VolunteerSignup> findByEventId(Long eventId);
    List<VolunteerSignup> findByEventIdAndStatus(Long eventId, SignupStatus status);

    @Query("SELECT vs FROM VolunteerSignup vs JOIN FETCH vs.user u JOIN FETCH vs.event e WHERE vs.event.id = :eventId")
    List<VolunteerSignup> findByEventIdWithDetails(@Param("eventId") Long eventId);

    @Query("SELECT vs FROM VolunteerSignup vs JOIN FETCH vs.user u JOIN FETCH vs.event e WHERE vs.user.id = :userId")
    List<VolunteerSignup> findByUserIdWithDetails(@Param("userId") Long userId);

    @Query("SELECT vs FROM VolunteerSignup vs JOIN FETCH vs.user u JOIN FETCH vs.event e WHERE vs.id = :id")
    Optional<VolunteerSignup> findByIdWithDetails(@Param("id") Long id);
}