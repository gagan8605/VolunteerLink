package com.soft.repository;

import com.soft.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.adminProfile ap LEFT JOIN FETCH u.volunteerProfile vp WHERE u.id = :id")
    Optional<User> findByIdWithProfiles(@Param("id") Long id);
}
