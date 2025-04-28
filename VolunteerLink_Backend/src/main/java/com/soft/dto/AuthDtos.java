package com.soft.dto;

import com.soft.enums.Gender;
import com.soft.enums.Role;
import java.time.LocalDate;

public class AuthDtos {

    private AuthDtos() {}

    public static class RegistrationRequestDto {
        private String fullName;
        private String email;
        private String password;
        private Role role;
        private String phoneNumber;
        private LocalDate dateOfBirth;
        private Gender gender;
        private String address;
        private String location;
        private String generalOrgType;
        private String designation;
        private String organizationName;
        private Integer yearsOfExperience;
        private String workEmail;
        private String officeLocation;
        private String areaOfInterest;
        private String availability;
        private String emergencyContactNumber;
        private String skillsCertifications;
        private String previousExperience;
        private Boolean willingToRelocate;
        private String preferredLocation;

        public RegistrationRequestDto() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

        public Gender getGender() { return gender; }
        public void setGender(Gender gender) { this.gender = gender; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getGeneralOrgType() { return generalOrgType; }
        public void setGeneralOrgType(String generalOrgType) { this.generalOrgType = generalOrgType; }

        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }

        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

        public Integer getYearsOfExperience() { return yearsOfExperience; }
        public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

        public String getWorkEmail() { return workEmail; }
        public void setWorkEmail(String workEmail) { this.workEmail = workEmail; }

        public String getOfficeLocation() { return officeLocation; }
        public void setOfficeLocation(String officeLocation) { this.officeLocation = officeLocation; }

        public String getAreaOfInterest() { return areaOfInterest; }
        public void setAreaOfInterest(String areaOfInterest) { this.areaOfInterest = areaOfInterest; }

        public String getAvailability() { return availability; }
        public void setAvailability(String availability) { this.availability = availability; }

        public String getEmergencyContactNumber() { return emergencyContactNumber; }
        public void setEmergencyContactNumber(String emergencyContactNumber) { this.emergencyContactNumber = emergencyContactNumber; }

        public String getSkillsCertifications() { return skillsCertifications; }
        public void setSkillsCertifications(String skillsCertifications) { this.skillsCertifications = skillsCertifications; }

        public String getPreviousExperience() { return previousExperience; }
        public void setPreviousExperience(String previousExperience) { this.previousExperience = previousExperience; }

        public Boolean getWillingToRelocate() { return willingToRelocate; }
        public void setWillingToRelocate(Boolean willingToRelocate) { this.willingToRelocate = willingToRelocate; }

        public String getPreferredLocation() { return preferredLocation; }
        public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private Long id;
        private String fullName;
        private Role role;
        private String message;

        public LoginResponse() {}

        public LoginResponse(Long id, String fullName, Role role, String message) {
            this.id = id;
            this.fullName = fullName;
            this.role = role;
            this.message = message;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
