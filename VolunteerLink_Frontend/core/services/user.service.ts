import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// **** Import environment ****
import { environment } from '../../../environments/environment';
// **** Verify import path for models ****
import { UserProfile, UserProfileUpdateRequest } from '../models/profile.model'; // Original path
// import { UserProfileUpdateRequest } from '../models/user.model'; // Original path

// More likely path based on previous context

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Use the base API URL from environment consistently
  private baseApiUrl = environment.apiUrl; // e.g., http://localhost:8080/api
  private http = inject(HttpClient);

  /**
   * Gets the profile details for the CURRENTLY LOGGED-IN user (Volunteer or Admin viewing own).
   * Assumes the endpoint lives under the role-specific path or a shared '/profile' path.
   * Using the '/volunteer/profile/{userId}' endpoint as per previous VolunteerController setup.
   * Admins might need a separate '/admin/profile/{adminId}' endpoint if different logic applies.
   * @param userId - The ID of the user whose profile to fetch (should match logged-in user).
   */
  getUserProfile(userId: number): Observable<UserProfile> {
    const url = `${this.baseApiUrl}/users/${userId}/profile`;
    console.log(`UserService: Fetching user profile from: ${url}`);
    // Assuming the backend returns data matching the UserProfile interface/model
    return this.http.get<UserProfile>(url);
  }
  /**
   * Updates the profile details for the CURRENTLY LOGGED-IN user.
   * Uses the '/volunteer/profile/{userId}' endpoint as per previous VolunteerController setup.
   * @param userId - The ID of the user whose profile to update (should match logged-in user).
   * @param profileData - The data to update (using UserProfileUpdate DTO).
   */
  updateUserProfile(userId: number, profileData:UserProfile): Observable<UserProfile> {
     // Using the endpoint defined in VolunteerController
    return this.http.put<UserProfile>(`${this.baseApiUrl}/volunteer/profile/${userId}`, profileData);
  }

  /**
   * Gets a specific volunteer's profile details, intended for an ADMIN view.
   * Uses the '/admin/volunteer-profile/{volunteerId}' endpoint defined in AdminController.
   * @param volunteerId - The ID of the VOLUNTEER whose profile the admin wants to view.
   */
  getVolunteerProfileForAdmin(volunteerId: number): Observable<UserProfile> {
    // *** FIX: Construct URL to match backend @GetMapping ***
    const url = `${this.baseApiUrl}/admin/volunteers/${volunteerId}/profile`;
    console.log(`UserService: Fetching volunteer profile from: ${url}`);
    // Assuming UserProfile is the expected response DTO type from this backend endpoint
    return this.http.get<UserProfile>(url);
}

   // Note: getUserProfileDetails was likely intended to be one of the methods above.
   // If you have a distinct /users/{userId}/profile endpoint, keep it, otherwise remove it.
   // getUserProfileDetails(userId: number): Observable<UserProfile> {
   //   return this.http.get<UserProfile>(`${this.baseApiUrl}/users/${userId}/profile`); // Example if endpoint exists
   // }
}