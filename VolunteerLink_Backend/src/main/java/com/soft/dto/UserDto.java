package com.soft.dto;

import com.soft.enums.Gender;
import com.soft.enums.Role;
import java.time.LocalDate;

public class UserDto {

    private UserDto() {}

    public static class AdminProfileDto {
        private String designation;
        private String organizationName;
        private Integer yearsOfExperience;
        private String workEmail;
        private String officeLocation;
		public AdminProfileDto(String designation, String organizationName, Integer yearsOfExperience, String workEmail,
				String officeLocation) {
			super();
			this.designation = designation;
			this.organizationName = organizationName;
			this.yearsOfExperience = yearsOfExperience;
			this.workEmail = workEmail;
			this.officeLocation = officeLocation;
		}
		public AdminProfileDto() {
			super();
			// TODO Auto-generated constructor stub
		}
		public String getDesignation() {
			return designation;
		}
		public void setDesignation(String designation) {
			this.designation = designation;
		}
		public String getOrganizationName() {
			return organizationName;
		}
		public void setOrganizationName(String organizationName) {
			this.organizationName = organizationName;
		}
		public Integer getYearsOfExperience() {
			return yearsOfExperience;
		}
		public void setYearsOfExperience(Integer yearsOfExperience) {
			this.yearsOfExperience = yearsOfExperience;
		}
		public String getWorkEmail() {
			return workEmail;
		}
		public void setWorkEmail(String workEmail) {
			this.workEmail = workEmail;
		}
		public String getOfficeLocation() {
			return officeLocation;
		}
		public void setOfficeLocation(String officeLocation) {
			this.officeLocation = officeLocation;
		}

       
    }

    public static class VolunteerProfileDto {
        private String areaOfInterest;
        private String availability;
        private String emergencyContactNumber;
        private String skillsCertifications;
        private String previousExperience;
        private Boolean willingToRelocate;
        private String preferredLocation;
		public VolunteerProfileDto() {
			super();
			// TODO Auto-generated constructor stub
		}
		public VolunteerProfileDto(String areaOfInterest, String availability, String emergencyContactNumber,
				String skillsCertifications, String previousExperience, Boolean willingToRelocate,
				String preferredLocation) {
			super();
			this.areaOfInterest = areaOfInterest;
			this.availability = availability;
			this.emergencyContactNumber = emergencyContactNumber;
			this.skillsCertifications = skillsCertifications;
			this.previousExperience = previousExperience;
			this.willingToRelocate = willingToRelocate;
			this.preferredLocation = preferredLocation;
		}
		public String getAreaOfInterest() {
			return areaOfInterest;
		}
		public void setAreaOfInterest(String areaOfInterest) {
			this.areaOfInterest = areaOfInterest;
		}
		public String getAvailability() {
			return availability;
		}
		public void setAvailability(String availability) {
			this.availability = availability;
		}
		public String getEmergencyContactNumber() {
			return emergencyContactNumber;
		}
		public void setEmergencyContactNumber(String emergencyContactNumber) {
			this.emergencyContactNumber = emergencyContactNumber;
		}
		public String getSkillsCertifications() {
			return skillsCertifications;
		}
		public void setSkillsCertifications(String skillsCertifications) {
			this.skillsCertifications = skillsCertifications;
		}
		public String getPreviousExperience() {
			return previousExperience;
		}
		public void setPreviousExperience(String previousExperience) {
			this.previousExperience = previousExperience;
		}
		public Boolean getWillingToRelocate() {
			return willingToRelocate;
		}
		public void setWillingToRelocate(Boolean willingToRelocate) {
			this.willingToRelocate = willingToRelocate;
		}
		public String getPreferredLocation() {
			return preferredLocation;
		}
		public void setPreferredLocation(String preferredLocation) {
			this.preferredLocation = preferredLocation;
		}

       
    }

    public static class UserProfileResponseDto {
        private Long id;
        private String fullName;
        private String email;
        private Role role;
        private String phoneNumber;
        private LocalDate dateOfBirth;
        private Gender gender;
        private String address;
        private String location;
        private String generalOrgType;
        private AdminProfileDto adminDetails;
        private VolunteerProfileDto volunteerDetails;
		public UserProfileResponseDto() {
			super();
			// TODO Auto-generated constructor stub
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getFullName() {
			return fullName;
		}
		public void setFullName(String fullName) {
			this.fullName = fullName;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public Role getRole() {
			return role;
		}
		public void setRole(Role role) {
			this.role = role;
		}
		public String getPhoneNumber() {
			return phoneNumber;
		}
		public void setPhoneNumber(String phoneNumber) {
			this.phoneNumber = phoneNumber;
		}
		public LocalDate getDateOfBirth() {
			return dateOfBirth;
		}
		public void setDateOfBirth(LocalDate dateOfBirth) {
			this.dateOfBirth = dateOfBirth;
		}
		public Gender getGender() {
			return gender;
		}
		public void setGender(Gender gender) {
			this.gender = gender;
		}
		public String getAddress() {
			return address;
		}
		public void setAddress(String address) {
			this.address = address;
		}
		public String getLocation() {
			return location;
		}
		public void setLocation(String location) {
			this.location = location;
		}
		public String getGeneralOrgType() {
			return generalOrgType;
		}
		public void setGeneralOrgType(String generalOrgType) {
			this.generalOrgType = generalOrgType;
		}
		public AdminProfileDto getAdminDetails() {
			return adminDetails;
		}
		public void setAdminDetails(AdminProfileDto adminDetails) {
			this.adminDetails = adminDetails;
		}
		public VolunteerProfileDto getVolunteerDetails() {
			return volunteerDetails;
		}
		public void setVolunteerDetails(VolunteerProfileDto volunteerDetails) {
			this.volunteerDetails = volunteerDetails;
		}

        
    }

    public static class BasicUserDto {
        private Long id;
        private String fullName;
        private String email;
        private Role role;

        public BasicUserDto(Long id, String fullName, String email, Role role) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public Role getRole() { return role; }
    }

     public static class UserProfileUpdateDto {
         private String fullName;
         private String email;
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
		public UserProfileUpdateDto() {
			super();
			// TODO Auto-generated constructor stub
		}
		public String getFullName() {
			return fullName;
		}
		public void setFullName(String fullName) {
			this.fullName = fullName;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getPhoneNumber() {
			return phoneNumber;
		}
		public void setPhoneNumber(String phoneNumber) {
			this.phoneNumber = phoneNumber;
		}
		public LocalDate getDateOfBirth() {
			return dateOfBirth;
		}
		public void setDateOfBirth(LocalDate dateOfBirth) {
			this.dateOfBirth = dateOfBirth;
		}
		public Gender getGender() {
			return gender;
		}
		public void setGender(Gender gender) {
			this.gender = gender;
		}
		public String getAddress() {
			return address;
		}
		public void setAddress(String address) {
			this.address = address;
		}
		public String getLocation() {
			return location;
		}
		public void setLocation(String location) {
			this.location = location;
		}
		public String getGeneralOrgType() {
			return generalOrgType;
		}
		public void setGeneralOrgType(String generalOrgType) {
			this.generalOrgType = generalOrgType;
		}
		public String getDesignation() {
			return designation;
		}
		public void setDesignation(String designation) {
			this.designation = designation;
		}
		public String getOrganizationName() {
			return organizationName;
		}
		public void setOrganizationName(String organizationName) {
			this.organizationName = organizationName;
		}
		public Integer getYearsOfExperience() {
			return yearsOfExperience;
		}
		public void setYearsOfExperience(Integer yearsOfExperience) {
			this.yearsOfExperience = yearsOfExperience;
		}
		public String getWorkEmail() {
			return workEmail;
		}
		public void setWorkEmail(String workEmail) {
			this.workEmail = workEmail;
		}
		public String getOfficeLocation() {
			return officeLocation;
		}
		public void setOfficeLocation(String officeLocation) {
			this.officeLocation = officeLocation;
		}
		public String getAreaOfInterest() {
			return areaOfInterest;
		}
		public void setAreaOfInterest(String areaOfInterest) {
			this.areaOfInterest = areaOfInterest;
		}
		public String getAvailability() {
			return availability;
		}
		public void setAvailability(String availability) {
			this.availability = availability;
		}
		public String getEmergencyContactNumber() {
			return emergencyContactNumber;
		}
		public void setEmergencyContactNumber(String emergencyContactNumber) {
			this.emergencyContactNumber = emergencyContactNumber;
		}
		public String getSkillsCertifications() {
			return skillsCertifications;
		}
		public void setSkillsCertifications(String skillsCertifications) {
			this.skillsCertifications = skillsCertifications;
		}
		public String getPreviousExperience() {
			return previousExperience;
		}
		public void setPreviousExperience(String previousExperience) {
			this.previousExperience = previousExperience;
		}
		public Boolean getWillingToRelocate() {
			return willingToRelocate;
		}
		public void setWillingToRelocate(Boolean willingToRelocate) {
			this.willingToRelocate = willingToRelocate;
		}
		public String getPreferredLocation() {
			return preferredLocation;
		}
		public void setPreferredLocation(String preferredLocation) {
			this.preferredLocation = preferredLocation;
		}

      
     }
}