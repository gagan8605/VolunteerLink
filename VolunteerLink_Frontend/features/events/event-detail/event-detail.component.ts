import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, Location, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Keep Router
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { SignupService } from '../../../core/services/signup.service';
import { UserService } from '../../../core/services/user.service'; // Keep if loading organizer profile
import { Event } from '../../../core/models/event.model';
import { SignupRequest } from '../../../core/models/signup.model';
import { UserProfile } from '../../../core/models/user.model'; // Keep if loading organizer profile
import { HttpErrorResponse } from '@angular/common/http';
// **** Import the Consent Modal Component ****
import { ConsentModalComponent } from '../../shared/consent-modal/consent-modal.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  // **** Add ConsentModalComponent to imports ****
  imports: [CommonModule, DatePipe, RouterLink, CurrencyPipe, ConsentModalComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() id?: string; // Event ID from route

  // Existing properties
  event: Event | null = null;
  organizer: UserProfile | null = null; // Keep if needed
  isLoading = true;
  error: string | null = null;
  signupError: string | null = null;
  signupSuccess: boolean = false;
  signupLoading: boolean = false;

  // **** NEW: Consent Modal State ****
  showConsentModal = false;
  // selectedEventForConsent is just 'this.event' in this component
  userIdForConsent: number | null = null; // Store user ID for confirmation

  // Injected services
  private eventService = inject(EventService);
  public authService = inject(AuthService);
  private signupService = inject(SignupService);
  private userService = inject(UserService); // Keep if loading organizer
  private location = inject(Location);
  private router = inject(Router);

  ngOnInit(): void {
    // Get current user ID once
    this.userIdForConsent = this.authService.getCurrentUserId();

    if (this.id) {
      const eventId = parseInt(this.id, 10);
      if (!isNaN(eventId)) {
        this.loadEvent(eventId); // Load event, potentially organizer too
      } else {
        this.error = 'Invalid event ID provided.';
        this.isLoading = false;
      }
    } else {
        this.error = 'No event ID provided.';
        this.isLoading = false;
    }
  }

  // Combined load function (or keep separate if preferred)
  loadEvent(eventId: number): void {
    this.isLoading = true;
    this.error = null;
    this.eventService.getEventById(eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.isLoading = false;
        // Optionally load organizer profile if ID exists
        // if (data.createdById) {
        //     this.loadOrganizerProfile(data.createdById);
        // }
      },
      error: (err) => {
        this.error = 'Failed to load event details.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // loadOrganizerProfile(organizerId: number): void { ... } // Keep if used

   // **** MODIFIED: Renamed old apply function ****
   private executeApplyForEvent(eventId: number, userId: number): void {
    this.signupError = null;
    this.signupSuccess = false;
    this.signupLoading = true;
    const request: SignupRequest = { userId: userId, eventId: eventId };

    this.signupService.applyForEvent(request).subscribe({
        next: (response) => {
             this.signupSuccess = true; // Mark success
             this.signupLoading = false;
             console.log('Successfully applied for event:', eventId);
             // Note: No local 'appliedEventIds' set here, relying on signupSuccess flag for UI state
        },
        error: (err: HttpErrorResponse) => {
             const errorMsg = err.error?.message || err.error?.error || 'Failed to apply.';
             // Handle conflict as success visually (already applied)
             if (err.status === 409 || errorMsg.toLowerCase().includes('already signed up')) {
                this.signupSuccess = true;
             } else {
                this.signupError = errorMsg;
             }
             this.signupLoading = false;
             console.error('Signup error:', err);
        }
    });
  }

    // **** NEW: Function to open the consent modal ****
    openConsentModal(): void {
        // Use the component's 'event' property
        if (!this.event || !this.userIdForConsent) {
            console.error("Event data or User ID missing for consent");
            this.signupError = "Cannot proceed: User or Event data missing.";
            return;
        }
        // No need to store selectedEventForConsent, we use this.event
        this.showConsentModal = true; // Show the modal
    }

    // **** NEW: Handler for consent confirmation ****
    handleConsentConfirm(): void {
        console.log("Consent confirmed for event:", this.event?.id);
        if (this.event && this.event.id && this.userIdForConsent) {
            this.executeApplyForEvent(this.event.id, this.userIdForConsent);
        }
        this.closeConsentModal();
    }

    // **** NEW: Handler for consent cancellation ****
    handleConsentCancel(): void {
        console.log("Consent cancelled/modal closed");
        this.closeConsentModal();
    }

    // **** NEW: Helper to reset modal state ****
    private closeConsentModal(): void {
         this.showConsentModal = false;
         // No selectedEventForConsent to clear in this component
    }

    // --- Existing helper methods ---

   canApply(event: Event | null): boolean {
      // Check against component's event property
      if (!event?.id) return false;
      const isEventPast = event.date ? new Date(event.date) < new Date() : true;
      if (isEventPast) return false;

      // Check against component's signup state flags
      return this.authService.isLoggedIn()
             && this.authService.isVolunteer()
             && !this.signupSuccess // Check if already successfully applied in this session
             && !this.signupLoading; // Check if currently applying
      // NOTE: This doesn't know about applications made in previous sessions
      // unless you add logic to fetch the user's signup status for this event OnInit
   }

   // Updated to use the correct public profile route
   viewOrganizerProfile(organizerId: number | undefined): void {
       if (organizerId) {
           // Navigate to the public profile route
           this.router.navigate(['/app/user-profile', organizerId]);
       } else {
           console.error("Cannot view organizer profile: Organizer ID is missing.");
       }
   }

  goBack(): void {
      this.location.back();
  }
}