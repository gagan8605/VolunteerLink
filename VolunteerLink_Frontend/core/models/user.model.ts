import { UserProfile, AdminProfile, VolunteerProfile } from "./profile.model";

export enum Role {
  Admin = 'ADMIN',
  Volunteer = 'VOLUNTEER'
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
    PREFER_NOT_SAY = 'PREFER_NOT_SAY'
}

export interface BasicUser {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
    id: number;
    fullName: string;
    role: Role;
    message: string;
}

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password?: string;
    role: Role;
    phoneNumber?: string | null;
    dateOfBirth?: string | null; // Use string 'yyyy-MM-dd'
    gender?: Gender | null;
    address?: string | null;
    location?: string | null;
    generalOrgType?: string | null;
    designation?: string | null;
    organizationName?: string | null;
    yearsOfExperience?: number | null;
    workEmail?: string | null;
    officeLocation?: string | null;
    areaOfInterest?: string | null;
    availability?: string | null;
    emergencyContactNumber?: string | null;
    skillsCertifications?: string | null;
    previousExperience?: string | null;
    willingToRelocate?: boolean | null;
    preferredLocation?: string | null;
}

export type { UserProfile, AdminProfile, VolunteerProfile };