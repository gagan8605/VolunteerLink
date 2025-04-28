package com.soft.entity;

import com.soft.enums.SignupStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "volunteer_signups", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "event_id"})
})
public class VolunteerSignup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    private SignupStatus status = SignupStatus.PENDING;

    private String adminFeedback;
    private String volunteerCancellationReason;
    private LocalDateTime cancelledByVolunteerAt;
    private String adminCancellationReason;
    private LocalDateTime cancelledByAdminAt;

    private LocalDateTime signedUpAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

   

    public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public User getUser() {
		return user;
	}



	public void setUser(User user) {
		this.user = user;
	}



	public Event getEvent() {
		return event;
	}



	public void setEvent(Event event) {
		this.event = event;
	}



	public SignupStatus getStatus() {
		return status;
	}



	public void setStatus(SignupStatus status) {
		this.status = status;
	}



	public String getAdminFeedback() {
		return adminFeedback;
	}



	public void setAdminFeedback(String adminFeedback) {
		this.adminFeedback = adminFeedback;
	}



	public String getVolunteerCancellationReason() {
		return volunteerCancellationReason;
	}



	public void setVolunteerCancellationReason(String volunteerCancellationReason) {
		this.volunteerCancellationReason = volunteerCancellationReason;
	}



	public LocalDateTime getCancelledByVolunteerAt() {
		return cancelledByVolunteerAt;
	}



	public void setCancelledByVolunteerAt(LocalDateTime cancelledByVolunteerAt) {
		this.cancelledByVolunteerAt = cancelledByVolunteerAt;
	}



	public String getAdminCancellationReason() {
		return adminCancellationReason;
	}



	public void setAdminCancellationReason(String adminCancellationReason) {
		this.adminCancellationReason = adminCancellationReason;
	}



	public LocalDateTime getCancelledByAdminAt() {
		return cancelledByAdminAt;
	}



	public void setCancelledByAdminAt(LocalDateTime cancelledByAdminAt) {
		this.cancelledByAdminAt = cancelledByAdminAt;
	}



	public LocalDateTime getSignedUpAt() {
		return signedUpAt;
	}



	public void setSignedUpAt(LocalDateTime signedUpAt) {
		this.signedUpAt = signedUpAt;
	}



	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}



	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}



	public VolunteerSignup() {
		super();
		// TODO Auto-generated constructor stub
	}



	@PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
