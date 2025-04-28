import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Router, RouterLink, ActivatedRoute, Params } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { SignupService } from '../../../core/services/signup.service';
import { Event } from '../../../core/models/event.model';
import { SignupRequest } from '../../../core/models/signup.model';
import { HttpErrorResponse } from '@angular/common/http';
// **** Import the Consent Modal Component ****
import { ConsentModalComponent } from '../../shared/consent-modal/consent-modal.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  // **** Add ConsentModalComponent to imports ****
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, ConsentModalComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  // Existing properties
  events: Event[] = [];
  isLoading = true;
  error: string | null = null;
  signupError: { [eventId: number]: string } = {};
  signupSuccess: { [eventId: number]: boolean } = {};
  signupLoading: { [eventId: number]: boolean } = {};
  searchCriteria: { location?: string | null; date?: string | null } = {};
  private queryParamSubscription: Subscription | undefined;
  private appliedEventIds = new Set<number>(); // Should be updated based on actual signups

  // **** NEW: Consent Modal State ****
  showConsentModal = false;
  selectedEventForConsent: Event | null = null;
  userIdForConsent: number | null = null; // Store user ID for confirmation

  // Injected services
  private eventService = inject(EventService);
  public authService = inject(AuthService);
  private signupService = inject(SignupService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Get current user ID once on init
    this.userIdForConsent = this.authService.getCurrentUserId();

    // Subscribe to query parameter changes for searching
    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
        this.searchCriteria.location = params['location'] || null;
        this.searchCriteria.date = params['date'] || null;
        this.loadEventsBasedOnCriteria();
    });

    // TODO: Optionally fetch user's current signups here to pre-populate
    // the 'appliedEventIds' set for more accurate 'Apply' button state.
  }

  ngOnDestroy(): void {
      this.queryParamSubscription?.unsubscribe();
  }

  loadEventsBasedOnCriteria(): void {
      this.isLoading = true;
      this.error = null;
      const location = this.searchCriteria.location;
      const date = this.searchCriteria.date;
      let eventObservable: Observable<Event[]>;

      if (location || date) {
          eventObservable = this.eventService.searchEvents(location, date);
      } else {
          eventObservable = this.eventService.getUpcomingEvents();
      }

      eventObservable.subscribe({
          next: (data) => {
              this.events = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              this.isLoading = false;
          },
          error: (err) => {
              this.error = `Failed to load events${(location || date) ? ' for search criteria' : ''}.`;
              console.error('Event loading error:', err);
              this.isLoading = false;
          }
      });
  }

  clearSearch(): void {
      this.searchCriteria = {};
      this.router.navigate(['/app/events']);
  }

  // **** MODIFIED: Renamed old apply function ****
  // This function now executes the API call AFTER consent is given
  private executeApplyForEvent(eventId: number, userId: number): void {
    // Reset status specific to this event
    this.signupError[eventId] = '';
    this.signupSuccess[eventId] = false;
    this.signupLoading[eventId] = true;

    const request: SignupRequest = { userId: userId, eventId: eventId };

    this.signupService.applyForEvent(request).subscribe({
        next: (response) => {
             this.signupSuccess[eventId] = true; // Mark as success
             this.signupLoading[eventId] = false; // Stop loading indicator
             this.appliedEventIds.add(eventId); // Update local state (placeholder)
             console.log('Successfully applied for event:', eventId);
        },
        error: (err: HttpErrorResponse) => {
             const errorMsg = err.error?.message || err.error || 'Failed to apply.';
             // Handle conflict as if already applied (visually)
             if (err.status === 409 || errorMsg.toLowerCase().includes('already signed up')) {
                 this.signupSuccess[eventId] = true; // Show success state
                 this.appliedEventIds.add(eventId);
             } else {
                this.signupError[eventId] = errorMsg; // Show specific error
             }
             this.signupLoading[eventId] = false; // Stop loading indicator
             console.error('Signup error for event', eventId, ':', err);
        }
    });
  }

  // **** NEW: Function to open the consent modal ****
  openConsentModal(event: Event | undefined): void {
      if (!event || !this.userIdForConsent) {
          console.error("Event or User ID missing for consent");
          this.signupError[event?.id ?? 0] = "Cannot proceed: User or Event data missing."; // Show error
          return;
      }
      this.selectedEventForConsent = event; // Store the event context
      this.showConsentModal = true; // Make the modal visible
  }

  // **** NEW: Handler for when user confirms consent ****
  handleConsentConfirm(): void {
      console.log("Consent confirmed for event:", this.selectedEventForConsent?.id);
      // Proceed with applying if event and user ID are still valid
      if (this.selectedEventForConsent && this.selectedEventForConsent.id && this.userIdForConsent) {
          this.executeApplyForEvent(this.selectedEventForConsent.id, this.userIdForConsent);
      }
      this.closeConsentModal(); // Close modal after confirmation
  }

  // **** NEW: Handler for when user cancels consent ****
  handleConsentCancel(): void {
      console.log("Consent cancelled/modal closed");
      this.closeConsentModal(); // Just close the modal
  }

  // **** NEW: Helper to reset modal state ****
  private closeConsentModal(): void {
       this.showConsentModal = false;
       this.selectedEventForConsent = null;
  }

  // --- Existing helper methods ---
  canApply(event: Event | undefined): boolean {
      if (!event || !event.id) return false;
      const isPast = new Date(event.date) < new Date();
      if (isPast) return false;
      const eventId = event.id;
      return this.authService.isLoggedIn()
             && this.authService.isVolunteer()
             && !this.signupSuccess[eventId]
             && !this.signupLoading[eventId]
             && !this.appliedEventIds.has(eventId);
  }

   isAdminView(event: Event | undefined): boolean {
       return this.authService.isLoggedIn() && !this.authService.isVolunteer();
   }

}