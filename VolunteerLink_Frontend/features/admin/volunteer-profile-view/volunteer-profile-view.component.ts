import { Component, Input, OnInit, inject } from '@angular/core';
// Import required modules
import { CommonModule, DatePipe, Location } from '@angular/common';
// Import services and models
import { UserService } from '../../../core/services/user.service';
// ** Verify this import path is correct for UserProfile **
import { UserProfile } from '../../../core/models/user.model';
import { Role, Gender } from '../../../core/models/user.model'; // Import enums

@Component({
  selector: 'app-volunteer-profile-view',
  standalone: true,
  // ** Ensure DatePipe is imported if used in the template **
  imports: [CommonModule, DatePipe],
  templateUrl: './volunteer-profile-view.component.html',
  styleUrls: ['./volunteer-profile-view.component.css']
})
export class VolunteerProfileViewComponent implements OnInit {
  // ** Match the Input property name to the route parameter name **
  @Input() volunteerId?: string;

  // State properties
  profile: UserProfile | null = null;
  isLoading = true;
  error: string | null = null;
  // Expose enums to template if needed (e.g., for conditional display based on role/gender)
  Role = Role;
  Gender = Gender;

  // Inject services
  private userService = inject(UserService);
  private location = inject(Location);

  ngOnInit(): void {
    console.log('VolunteerProfileViewComponent - ngOnInit - Input volunteerId:', this.volunteerId); // Debug Log

    // Check if the volunteerId input property has been bound from the route
    if (this.volunteerId) {
      const userId = parseInt(this.volunteerId, 10); // Convert string param to number
      if (!isNaN(userId)) {
        this.loadProfile(userId); // Load profile if ID is a valid number
      } else {
        // Handle case where volunteerId is not a valid number
        this.error = `Invalid Volunteer ID format provided: ${this.volunteerId}`;
        console.error(this.error);
        this.isLoading = false;
      }
    } else {
       // This error should now only appear if withComponentInputBinding isn't working
       // or if the route parameter name doesn't match the @Input name.
       this.error = 'Volunteer ID was not provided to the component.';
       console.error(this.error);
       this.isLoading = false;
    }
  }

  /**
   * Fetches the volunteer's profile details using the UserService.
   * @param userId - The numeric ID of the volunteer profile to load.
   */
  loadProfile(userId: number): void {
    this.isLoading = true;
    this.error = null;
    console.log(`Calling getVolunteerProfileForAdmin with ID: ${userId}`); // Debug Log

    // ** Use the correct service method for admin viewing volunteer profile **
    this.userService.getVolunteerProfileForAdmin(userId).subscribe({
      next: (data) => {
        console.log("Profile data received:", data); // Debug Log
         // Double-check if the fetched user is actually a volunteer
         if (data && data.role === Role.Volunteer) {
             this.profile = data;
         } else {
             // Handle case where the ID belongs to an Admin or user type is missing/wrong
             this.error = "Cannot view profile: The specified user is not a volunteer.";
             this.profile = null; // Ensure profile is null if not a volunteer
             console.warn(this.error, 'User data:', data);
         }
        this.isLoading = false;
      },
      error: (err) => {
        // Handle API errors (e.g., 404 Not Found, 500 Server Error)
        this.error = err.error?.message || err.message || 'Failed to load volunteer profile.';
        console.error('Error loading volunteer profile:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigates back to the previous page in the browser history.
   */
  goBack(): void {
    this.location.back();
  }
}