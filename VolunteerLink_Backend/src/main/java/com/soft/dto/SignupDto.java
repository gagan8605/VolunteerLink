package com.soft.dto;

import com.soft.enums.SignupStatus;
import java.time.LocalDateTime;

public class SignupDto {

    private SignupDto() {}

    public static class SignupRequestDto {
        private Long userId;
        private Long eventId;

        public SignupRequestDto() {}

        public SignupRequestDto(Long userId, Long eventId) {
            this.userId = userId;
            this.eventId = eventId;
        }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }
    }

    public static class SignupResponseDto {
        private Long id;
        private Long userId;
        private String userName;
        private Long eventId;
        private String eventTitle;
        private LocalDateTime eventDate;
        private SignupStatus status;
        private String adminFeedback;
        private String volunteerCancellationReason;
        private LocalDateTime cancelledByVolunteerAt;
        private String adminCancellationReason;
        private LocalDateTime cancelledByAdminAt;
        private LocalDateTime signedUpAt;
        private LocalDateTime updatedAt;

        public SignupResponseDto() {}
        

        public SignupResponseDto(Long id, Long userId, String userName, Long eventId, String eventTitle,
				LocalDateTime eventDate, SignupStatus status, String adminFeedback, String volunteerCancellationReason,
				LocalDateTime cancelledByVolunteerAt, String adminCancellationReason, LocalDateTime cancelledByAdminAt,
				LocalDateTime signedUpAt, LocalDateTime updatedAt) {
			super();
			this.id = id;
			this.userId = userId;
			this.userName = userName;
			this.eventId = eventId;
			this.eventTitle = eventTitle;
			this.eventDate = eventDate;
			this.status = status;
			this.adminFeedback = adminFeedback;
			this.volunteerCancellationReason = volunteerCancellationReason;
			this.cancelledByVolunteerAt = cancelledByVolunteerAt;
			this.adminCancellationReason = adminCancellationReason;
			this.cancelledByAdminAt = cancelledByAdminAt;
			this.signedUpAt = signedUpAt;
			this.updatedAt = updatedAt;
		}


		public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }

        public String getEventTitle() { return eventTitle; }
        public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

        public LocalDateTime getEventDate() { return eventDate; }
        public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

        public SignupStatus getStatus() { return status; }
        public void setStatus(SignupStatus status) { this.status = status; }

        public String getAdminFeedback() { return adminFeedback; }
        public void setAdminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; }

        public String getVolunteerCancellationReason() { return volunteerCancellationReason; }
        public void setVolunteerCancellationReason(String volunteerCancellationReason) { this.volunteerCancellationReason = volunteerCancellationReason; }

        public LocalDateTime getCancelledByVolunteerAt() { return cancelledByVolunteerAt; }
        public void setCancelledByVolunteerAt(LocalDateTime cancelledByVolunteerAt) { this.cancelledByVolunteerAt = cancelledByVolunteerAt; }

        public String getAdminCancellationReason() { return adminCancellationReason; }
        public void setAdminCancellationReason(String adminCancellationReason) { this.adminCancellationReason = adminCancellationReason; }

        public LocalDateTime getCancelledByAdminAt() { return cancelledByAdminAt; }
        public void setCancelledByAdminAt(LocalDateTime cancelledByAdminAt) { this.cancelledByAdminAt = cancelledByAdminAt; }

        public LocalDateTime getSignedUpAt() { return signedUpAt; }
        public void setSignedUpAt(LocalDateTime signedUpAt) { this.signedUpAt = signedUpAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    public static class AdminSignupUpdateDto {
        private SignupStatus status;
        private String feedbackOrReason;

        public AdminSignupUpdateDto() {}

        public AdminSignupUpdateDto(SignupStatus status, String feedbackOrReason) {
            this.status = status;
            this.feedbackOrReason = feedbackOrReason;
        }

        public SignupStatus getStatus() { return status; }
        public void setStatus(SignupStatus status) { this.status = status; }

        public String getFeedbackOrReason() { return feedbackOrReason; }
        public void setFeedbackOrReason(String feedbackOrReason) { this.feedbackOrReason = feedbackOrReason; }
    }

    public static class VolunteerCancellationDto {
        private String reason;

        public VolunteerCancellationDto() {}

        public VolunteerCancellationDto(String reason) {
            this.reason = reason;
        }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
