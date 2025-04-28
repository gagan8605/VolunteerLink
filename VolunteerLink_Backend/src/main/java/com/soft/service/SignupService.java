package com.soft.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soft.dto.SignupDto.AdminSignupUpdateDto;
import com.soft.dto.SignupDto.SignupRequestDto;
import com.soft.dto.SignupDto.SignupResponseDto;
import com.soft.dto.SignupDto.VolunteerCancellationDto;
import com.soft.entity.Event;
import com.soft.entity.User;
import com.soft.entity.VolunteerSignup;
import com.soft.enums.SignupStatus;
import com.soft.repository.EventRepository;
import com.soft.repository.UserRepository;
import com.soft.repository.VolunteerSignupRepository;


@Service
public class SignupService {

    private final VolunteerSignupRepository signupRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private static final DateTimeFormatter CSV_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final long CANCELLATION_WINDOW_HOURS = 12;

    public SignupService(VolunteerSignupRepository signupRepository, UserRepository userRepository, EventRepository eventRepository) {
        this.signupRepository = signupRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    public SignupResponseDto applyForEvent(SignupRequestDto requestDto) {
        User user = userRepository.findById(requestDto.getUserId()).get();
        Event event = eventRepository.findById(requestDto.getEventId()).get();

        if (event.getDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot sign up for past events.");
        }

        if (signupRepository.findByUserIdAndEventId(requestDto.getUserId(), requestDto.getEventId()).isPresent()) {
            throw new IllegalStateException("You Have already signed up for this event.");
        }

        VolunteerSignup signup = new VolunteerSignup();
        signup.setUser(user);
        signup.setEvent(event);
        signup.setStatus(SignupStatus.PENDING);

        VolunteerSignup savedSignup = signupRepository.save(signup);

        
        SignupResponseDto dto = new SignupResponseDto();
        dto.setId(savedSignup.getId());
        dto.setStatus(savedSignup.getStatus());
        dto.setSignedUpAt(savedSignup.getSignedUpAt());
        dto.setUpdatedAt(savedSignup.getUpdatedAt());
        if (savedSignup.getUser() != null) {
            dto.setUserId(savedSignup.getUser().getId());
            dto.setUserName(savedSignup.getUser().getFullName());
        }
        if (savedSignup.getEvent() != null) {
            dto.setEventId(savedSignup.getEvent().getId());
            dto.setEventTitle(savedSignup.getEvent().getTitle());
            dto.setEventDate(savedSignup.getEvent().getDate());
        }
        return dto;
    }

    public SignupResponseDto cancelSignupByVolunteer(Long signupId, Long volunteerUserId, VolunteerCancellationDto cancellationDto) {
        VolunteerSignup signup = signupRepository.findByIdWithDetails(signupId).get();

        if (!signup.getUser().getId().equals(volunteerUserId)) {
            throw new SecurityException("User not authorized to cancel this signup.");
        }

        if (signup.getStatus() == SignupStatus.CANCELLED_BY_VOLUNTEER || signup.getStatus() == SignupStatus.CANCELLED_BY_ADMIN) {
            throw new IllegalStateException("Signup has already been cancelled.");
        }

        if (signup.getStatus() != SignupStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED signups can be cancelled by the volunteer. Current status: " + signup.getStatus());
        }

        LocalDateTime eventStartTime = signup.getEvent().getDate();
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilEvent = ChronoUnit.HOURS.between(now, eventStartTime);

        if (hoursUntilEvent < CANCELLATION_WINDOW_HOURS) {
            throw new IllegalStateException("Cancellation period has passed. Cannot cancel within " + CANCELLATION_WINDOW_HOURS + " hours of the event.");
        }

        signup.setStatus(SignupStatus.CANCELLED_BY_VOLUNTEER);
        signup.setVolunteerCancellationReason(cancellationDto.getReason());
        signup.setCancelledByVolunteerAt(now);
        signup.setAdminFeedback(null);
        signup.setAdminCancellationReason(null);
        signup.setCancelledByAdminAt(null);

        VolunteerSignup updatedSignup = signupRepository.save(signup);

     
        SignupResponseDto dto = new SignupResponseDto();
        dto.setId(updatedSignup.getId());
        dto.setStatus(updatedSignup.getStatus());
        dto.setVolunteerCancellationReason(updatedSignup.getVolunteerCancellationReason());
        dto.setCancelledByVolunteerAt(updatedSignup.getCancelledByVolunteerAt());
        dto.setAdminFeedback(updatedSignup.getAdminFeedback());
        dto.setAdminCancellationReason(updatedSignup.getAdminCancellationReason());
        dto.setCancelledByAdminAt(updatedSignup.getCancelledByAdminAt());
        dto.setSignedUpAt(updatedSignup.getSignedUpAt());
        dto.setUpdatedAt(updatedSignup.getUpdatedAt());
        if (updatedSignup.getUser() != null) {
            dto.setUserId(updatedSignup.getUser().getId());
            dto.setUserName(updatedSignup.getUser().getFullName());
        }
        if (updatedSignup.getEvent() != null) {
            dto.setEventId(updatedSignup.getEvent().getId());
            dto.setEventTitle(updatedSignup.getEvent().getTitle());
            dto.setEventDate(updatedSignup.getEvent().getDate());
        }
        return dto;
    }

    public SignupResponseDto manageSignupByAdmin(Long signupId, Long adminUserId, AdminSignupUpdateDto updateDto) {
        VolunteerSignup signup = signupRepository.findByIdWithDetails(signupId).get();

        if (!signup.getEvent().getCreatedBy().getId().equals(adminUserId)) {
            throw new SecurityException("User not authorized to manage this signup.");
        }

        SignupStatus targetStatus = updateDto.getStatus();
        if (targetStatus == null) {
            throw new IllegalArgumentException("Target status cannot be null.");
        }

        if (targetStatus != SignupStatus.APPROVED && targetStatus != SignupStatus.REJECTED && targetStatus != SignupStatus.CANCELLED_BY_ADMIN) {
            throw new IllegalArgumentException("Invalid target status for admin action: " + targetStatus);
        }

        if (signup.getStatus() != SignupStatus.PENDING && signup.getStatus() != SignupStatus.APPROVED && targetStatus != SignupStatus.CANCELLED_BY_ADMIN) {
            throw new IllegalStateException("Cannot manage signup with status: " + signup.getStatus() + " for action: " + targetStatus);
        }

        switch (targetStatus) {
            case APPROVED:
                if (signup.getStatus() != SignupStatus.PENDING) {
                    throw new IllegalStateException("Can only approve PENDING signups. Current status: " + signup.getStatus());
                }
                signup.setStatus(SignupStatus.APPROVED);
                signup.setAdminFeedback(updateDto.getFeedbackOrReason());
                break;
            case REJECTED:
                if (signup.getStatus() != SignupStatus.PENDING) {
                    throw new IllegalStateException("Can only reject PENDING signups. Current status: " + signup.getStatus());
                }
                signup.setStatus(SignupStatus.REJECTED);
                signup.setAdminFeedback(updateDto.getFeedbackOrReason());
                break;
            case CANCELLED_BY_ADMIN:
                if (signup.getStatus() != SignupStatus.APPROVED && signup.getStatus() != SignupStatus.PENDING) {
                    throw new IllegalStateException("Admin can only cancel APPROVED or PENDING signups. Current status: " + signup.getStatus());
                }
                signup.setStatus(SignupStatus.CANCELLED_BY_ADMIN);
                signup.setAdminCancellationReason(updateDto.getFeedbackOrReason());
                signup.setCancelledByAdminAt(LocalDateTime.now());
                break;
            default:
                throw new IllegalArgumentException("Unsupported target status: " + targetStatus);
        }

        VolunteerSignup updatedSignup = signupRepository.save(signup);

        SignupResponseDto dto = new SignupResponseDto();
        dto.setId(updatedSignup.getId());
        dto.setStatus(updatedSignup.getStatus());
        dto.setAdminFeedback(updatedSignup.getAdminFeedback());
        dto.setVolunteerCancellationReason(updatedSignup.getVolunteerCancellationReason());
        dto.setCancelledByVolunteerAt(updatedSignup.getCancelledByVolunteerAt());
        dto.setAdminCancellationReason(updatedSignup.getAdminCancellationReason());
        dto.setCancelledByAdminAt(updatedSignup.getCancelledByAdminAt());
        dto.setSignedUpAt(updatedSignup.getSignedUpAt());
        dto.setUpdatedAt(updatedSignup.getUpdatedAt());
        if (updatedSignup.getUser() != null) {
            dto.setUserId(updatedSignup.getUser().getId());
            dto.setUserName(updatedSignup.getUser().getFullName());
        }
        if (updatedSignup.getEvent() != null) {
            dto.setEventId(updatedSignup.getEvent().getId());
            dto.setEventTitle(updatedSignup.getEvent().getTitle());
            dto.setEventDate(updatedSignup.getEvent().getDate());
        }
        return dto;
    }

    public List<SignupResponseDto> getSignupsForEvent(Long eventId) {
        return signupRepository.findByEventIdWithDetails(eventId).stream()
                .map(signup -> {
                    SignupResponseDto dto = new SignupResponseDto();
                    dto.setId(signup.getId());
                    dto.setStatus(signup.getStatus());
                    dto.setAdminFeedback(signup.getAdminFeedback());
                    dto.setVolunteerCancellationReason(signup.getVolunteerCancellationReason());
                    dto.setCancelledByVolunteerAt(signup.getCancelledByVolunteerAt());
                    dto.setAdminCancellationReason(signup.getAdminCancellationReason());
                    dto.setCancelledByAdminAt(signup.getCancelledByAdminAt());
                    dto.setSignedUpAt(signup.getSignedUpAt());
                    dto.setUpdatedAt(signup.getUpdatedAt());
                    if (signup.getUser() != null) {
                        dto.setUserId(signup.getUser().getId());
                        dto.setUserName(signup.getUser().getFullName());
                    }
                    if (signup.getEvent() != null) {
                        dto.setEventId(signup.getEvent().getId());
                        dto.setEventTitle(signup.getEvent().getTitle());
                        dto.setEventDate(signup.getEvent().getDate());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<SignupResponseDto> getSignupsForUser(Long userId) {
        return signupRepository.findByUserIdWithDetails(userId).stream()
            .map(signup -> {
                SignupResponseDto dto = new SignupResponseDto();
                dto.setId(signup.getId());
                dto.setStatus(signup.getStatus());
                dto.setAdminFeedback(signup.getAdminFeedback());
                dto.setVolunteerCancellationReason(signup.getVolunteerCancellationReason());
                dto.setCancelledByVolunteerAt(signup.getCancelledByVolunteerAt());
                dto.setAdminCancellationReason(signup.getAdminCancellationReason());
                dto.setCancelledByAdminAt(signup.getCancelledByAdminAt());
                dto.setSignedUpAt(signup.getSignedUpAt());
                dto.setUpdatedAt(signup.getUpdatedAt());
                if (signup.getUser() != null) {
                    dto.setUserId(signup.getUser().getId());
                    dto.setUserName(signup.getUser().getFullName());
                }
                if (signup.getEvent() != null) {
                    dto.setEventId(signup.getEvent().getId());
                    dto.setEventTitle(signup.getEvent().getTitle());
                    dto.setEventDate(signup.getEvent().getDate());
                }
                return dto;
            })
            .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public String generateEventParticipationReport(Long eventId) {
        List<VolunteerSignup> signups = signupRepository.findByEventIdWithDetails(eventId);

        if (signups.isEmpty()) {
            return "SignupID,VolunteerName,VolunteerEmail,EventTitle,EventDate,SignupStatus,AdminFeedback,VolunteerCancellationReason,CancelledByVolunteerAt,AdminCancellationReason,CancelledByAdminAt,SignedUpAt,UpdatedAt\nNo signups found for this event.";
        }

        StringBuilder csvData = new StringBuilder();
        csvData.append("SignupID,VolunteerName,VolunteerEmail,EventTitle,EventDate,SignupStatus,AdminFeedback,VolunteerCancellationReason,CancelledByVolunteerAt,AdminCancellationReason,CancelledByAdminAt,SignedUpAt,UpdatedAt\n");

        for (VolunteerSignup signup : signups) {
            csvData.append(escapeCsv(signup.getId())).append(",");
            csvData.append(escapeCsv(signup.getUser() != null ? signup.getUser().getFullName() : "N/A")).append(",");
            csvData.append(escapeCsv(signup.getUser() != null ? signup.getUser().getEmail() : "N/A")).append(",");
            csvData.append(escapeCsv(signup.getEvent() != null ? signup.getEvent().getTitle() : "N/A")).append(",");
            csvData.append(escapeCsv(signup.getEvent() != null && signup.getEvent().getDate() != null ? signup.getEvent().getDate().format(CSV_DATE_FORMATTER) : "")).append(",");
            csvData.append(escapeCsv(signup.getStatus())).append(",");
            csvData.append(escapeCsv(signup.getAdminFeedback())).append(",");
            csvData.append(escapeCsv(signup.getVolunteerCancellationReason())).append(",");
            csvData.append(escapeCsv(signup.getCancelledByVolunteerAt() != null ? signup.getCancelledByVolunteerAt().format(CSV_DATE_FORMATTER) : "")).append(",");
            csvData.append(escapeCsv(signup.getAdminCancellationReason())).append(",");
            csvData.append(escapeCsv(signup.getCancelledByAdminAt() != null ? signup.getCancelledByAdminAt().format(CSV_DATE_FORMATTER) : "")).append(",");
            csvData.append(escapeCsv(signup.getSignedUpAt() != null ? signup.getSignedUpAt().format(CSV_DATE_FORMATTER) : "")).append(",");
            csvData.append(escapeCsv(signup.getUpdatedAt() != null ? signup.getUpdatedAt().format(CSV_DATE_FORMATTER) : "")).append("\n");
        }
        return csvData.toString();
    }

    private String escapeCsv(Object value) {
        if (value == null) return "";
        String stringValue = value.toString();
        String escaped = stringValue.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\"") || escaped.contains("\n")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }

    private String escapeCsv(Enum<?> value) {
        if (value == null) return "";
        return escapeCsv(value.name());
    }

	public Optional<SignupResponseDto> getSignupById(Long signupId) {
		
		return null;
	}


}
