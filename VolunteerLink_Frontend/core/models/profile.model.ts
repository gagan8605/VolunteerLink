export interface AdminProfile {
    designation?: string;
    organizationName?: string;
    yearsOfExperience?: number;
    workEmail?: string;
    officeLocation?: string;
  }
  
  export interface VolunteerProfile {
    areaOfInterest?: string;
    availability?: string;
    emergencyContactNumber?: string;
    skillsCertifications?: string;
    previousExperience?: string;
    willingToRelocate?: boolean;
    preferredLocation?: string;
  }
  
  export interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'VOLUNTEER';
    phoneNumber?: string | null;
    dateOfBirth?: string | null; // Keep as string for form binding
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_SAY' | null;
    address?: string | null;
    location?: string | null;
    generalOrgType?: string | null;
    adminDetails?: AdminProfile | null;
    volunteerDetails?: VolunteerProfile | null;
  }
  
  export interface UserProfileUpdateRequest {
     fullName?: string;
     email?: string; // Handle carefully if allowed
     phoneNumber?: string | null;
     dateOfBirth?: string | null;
     gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_SAY' | null;
     address?: string | null;
     location?: string | null;
     generalOrgType?: string | null;
     designation?: string | null;
     organizationName?: string | null;
     yearsOfExperience?: number | null;
     workEmail?: string | null; // Handle carefully if allowed
     officeLocation?: string | null;
     areaOfInterest?: string | null;
     availability?: string | null;
     emergencyContactNumber?: string | null;
     skillsCertifications?: string | null;
     previousExperience?: string | null;
     willingToRelocate?: boolean | null;
     preferredLocation?: string | null;
  }