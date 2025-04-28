package com.soft.service;

import com.soft.dto.AuthDtos;
import com.soft.dto.UserDto;
import com.soft.entity.AdminProfile;
import com.soft.entity.User;
import com.soft.entity.VolunteerProfile;
import com.soft.enums.Role;
import com.soft.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

  
    public User registerUser(AuthDtos.RegistrationRequestDto request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setLocation(request.getLocation());
        user.setGeneralOrgType(request.getGeneralOrgType());

        if (request.getRole() == Role.ADMIN) {
            AdminProfile profile = new AdminProfile();
            profile.setDesignation(request.getDesignation());
            profile.setOrganizationName(request.getOrganizationName());
            profile.setYearsOfExperience(request.getYearsOfExperience());
            profile.setWorkEmail(request.getWorkEmail());
            profile.setOfficeLocation(request.getOfficeLocation());
            user.addAdminProfile(profile);
        } else if (request.getRole() == Role.VOLUNTEER) {
            VolunteerProfile profile = new VolunteerProfile();
            profile.setAreaOfInterest(request.getAreaOfInterest());
            profile.setAvailability(request.getAvailability());
            profile.setEmergencyContactNumber(request.getEmergencyContactNumber());
            profile.setSkillsCertifications(request.getSkillsCertifications());
            profile.setPreviousExperience(request.getPreviousExperience());
            profile.setWillingToRelocate(request.getWillingToRelocate());
            profile.setPreferredLocation(request.getPreferredLocation());
            user.addVolunteerProfile(profile);
        }

        return userRepository.save(user);
    }

    public Optional<User> loginUser(AuthDtos.LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

 
    public Optional<UserDto.UserProfileResponseDto> getUserProfileDetails(Long userId) {
        Optional<User> userOpt = userRepository.findByIdWithProfiles(userId);
        return userOpt.map(this::mapUserToUserProfileResponseDto);
    }

    public Optional<UserDto.UserProfileResponseDto> updateUserProfile(Long userId, UserDto.UserProfileUpdateDto updateDto) {
        User user = userRepository.findByIdWithProfiles(userId).get();

        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getEmail() != null && !updateDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateDto.getEmail())) {
                throw new IllegalArgumentException("New email address is already in use.");
            }
            user.setEmail(updateDto.getEmail());
        }
        if (updateDto.getPhoneNumber() != null) user.setPhoneNumber(updateDto.getPhoneNumber());
        if (updateDto.getDateOfBirth() != null) user.setDateOfBirth(updateDto.getDateOfBirth());
        if (updateDto.getGender() != null) user.setGender(updateDto.getGender());
        if (updateDto.getAddress() != null) user.setAddress(updateDto.getAddress());
        if (updateDto.getLocation() != null) user.setLocation(updateDto.getLocation());
        if (updateDto.getGeneralOrgType() != null) user.setGeneralOrgType(updateDto.getGeneralOrgType());

        if (user.getRole() == Role.ADMIN) {
            AdminProfile profile = user.getAdminProfile();
            if (profile == null) {
                profile = new AdminProfile();
                user.addAdminProfile(profile);
            }
            if (updateDto.getDesignation() != null) profile.setDesignation(updateDto.getDesignation());
            if (updateDto.getOrganizationName() != null) profile.setOrganizationName(updateDto.getOrganizationName());
            if (updateDto.getYearsOfExperience() != null) profile.setYearsOfExperience(updateDto.getYearsOfExperience());
            if (updateDto.getWorkEmail() != null && !updateDto.getWorkEmail().equals(profile.getWorkEmail())) {
                profile.setWorkEmail(updateDto.getWorkEmail());
            }
            if (updateDto.getOfficeLocation() != null) profile.setOfficeLocation(updateDto.getOfficeLocation());

        } else if (user.getRole() == Role.VOLUNTEER) {
            VolunteerProfile profile = user.getVolunteerProfile();
            if (profile == null) {
                profile = new VolunteerProfile();
                user.addVolunteerProfile(profile);
            }
            if (updateDto.getAreaOfInterest() != null) profile.setAreaOfInterest(updateDto.getAreaOfInterest());
            if (updateDto.getAvailability() != null) profile.setAvailability(updateDto.getAvailability());
            if (updateDto.getEmergencyContactNumber() != null) profile.setEmergencyContactNumber(updateDto.getEmergencyContactNumber());
            if (updateDto.getSkillsCertifications() != null) profile.setSkillsCertifications(updateDto.getSkillsCertifications());
            if (updateDto.getPreviousExperience() != null) profile.setPreviousExperience(updateDto.getPreviousExperience());
            if (updateDto.getWillingToRelocate() != null) profile.setWillingToRelocate(updateDto.getWillingToRelocate());
            if (updateDto.getPreferredLocation() != null) profile.setPreferredLocation(updateDto.getPreferredLocation());
        }

        User updatedUser = userRepository.save(user);
        return Optional.of(mapUserToUserProfileResponseDto(updatedUser));
    }

    private UserDto.UserProfileResponseDto mapUserToUserProfileResponseDto(User user) {
        UserDto.UserProfileResponseDto dto = new UserDto.UserProfileResponseDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setLocation(user.getLocation());
        dto.setGeneralOrgType(user.getGeneralOrgType());

        if (user.getRole() == Role.ADMIN && user.getAdminProfile() != null) {
            AdminProfile ap = user.getAdminProfile();
            dto.setAdminDetails(new UserDto.AdminProfileDto(
                ap.getDesignation(), ap.getOrganizationName(), ap.getYearsOfExperience(),
                ap.getWorkEmail(), ap.getOfficeLocation()
            ));
        } else {
            dto.setAdminDetails(null);
        }

        if (user.getRole() == Role.VOLUNTEER && user.getVolunteerProfile() != null) {
            VolunteerProfile vp = user.getVolunteerProfile();
            dto.setVolunteerDetails(new UserDto.VolunteerProfileDto(
                vp.getAreaOfInterest(), vp.getAvailability(), vp.getEmergencyContactNumber(),
                vp.getSkillsCertifications(), vp.getPreviousExperience(),
                vp.getWillingToRelocate(), vp.getPreferredLocation()
            ));
        } else {
            dto.setVolunteerDetails(null);
        }
        return dto;
    }
}

 