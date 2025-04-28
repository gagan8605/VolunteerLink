export enum SignupStatus {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    CancelledByVolunteer = 'CANCELLED_BY_VOLUNTEER',
    CancelledByAdmin = 'CANCELLED_BY_ADMIN'
}

export interface Signup {
    id: number;
    userId: number;
    userName: string;
    eventId: number;
    eventTitle: string;
    eventDate?: string | Date | null;
    status: SignupStatus;
    adminFeedback?: string | null;
    volunteerCancellationReason?: string | null;
    cancelledByVolunteerAt?: string | Date | null;
    adminCancellationReason?: string | null;
    cancelledByAdminAt?: string | Date | null;
    signedUpAt?: string | Date;
    updatedAt?: string | Date;
}

export interface SignupRequest {
    userId: number;
    eventId: number;
}

export interface VolunteerCancellationRequest {
    reason: string;
}

export interface AdminSignupUpdateRequest {
    status: SignupStatus;
    feedbackOrReason?: string | null;
}