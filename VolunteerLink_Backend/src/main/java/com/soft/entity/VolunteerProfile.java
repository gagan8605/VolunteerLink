package com.soft.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "volunteer_profiles")
public class VolunteerProfile {

    @Id
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String areaOfInterest;
    private String availability;
    private String emergencyContactNumber;
    @Column(columnDefinition = "TEXT")
    private String skillsCertifications;
    @Column(columnDefinition = "TEXT")
    private String previousExperience;
    private Boolean willingToRelocate = false;
    private String preferredLocation;
	public VolunteerProfile() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
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