import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Added RouterLink just in case template uses it elsewhere
import { SignupService } from '../../../core/services/signup.service';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
// Ensure AdminSignupUpdateRequest exists and is imported
import { Signup, SignupStatus, AdminSignupUpdateRequest } from '../../../core/models/signup.model';
import { Event } from '../../../core/models/event.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-volunteers',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule], // Removed RouterLink
  templateUrl: './view-volunteers.component.html',
  styleUrls: ['./view-volunteers.component.css']
})
export class ViewVolunteersComponent implements OnInit {
   @Input() id?: string; // Event ID from route

   signups: Signup[] = [];
   event: Event | null = null;
   isLoading = true;
   error: string | null = null;
   statusUpdateError: { [signupId: number]: string } = {};
   statusUpdateLoading: { [signupId: number]: boolean } = {};
   currentAdminId: number | null = null;
   SignupStatus = SignupStatus;
   feedbackForms: { [signupId: number]: FormGroup } = {};

   private signupService = inject(SignupService);
   private eventService = inject(EventService);
   private authService = inject(AuthService);
   private location = inject(Location);
   private router = inject(Router); // Router for navigation
   private fb = inject(FormBuilder);

   ngOnInit(): void {
     this.currentAdminId = this.authService.getCurrentUserId();
     if (this.id && this.currentAdminId) {
       const eventId = parseInt(this.id, 10);
       if (!isNaN(eventId)) {
         this.loadEventDetails(eventId);
         this.loadSignups(eventId);
       } else {
         this.error = 'Invalid event ID.';
         this.isLoading = false;
       }
     } else {
       this.error = 'Event ID or Admin ID missing.';
       this.isLoading = false;
     }
   }

   loadEventDetails(eventId: number): void {
       this.eventService.getEventById(eventId).subscribe({
           next: (eventData) => { this.event = eventData; },
           error: (err) => { console.error("Failed to load event details", err); }
       });
   }

   loadSignups(eventId: number): void {
     this.isLoading = true;
     this.error = null;
     this.signupService.getVolunteersForEvent(eventId).subscribe({
       next: (data) => {
         this.signups = data;
         this.initializeFeedbackForms();
         this.isLoading = false;
       },
       error: (err) => {
         this.error = 'Failed to load volunteer signups for this event.';
         console.error(err);
         this.isLoading = false;
       }
     });
   }

   initializeFeedbackForms(): void {
       this.feedbackForms = {}; // Reset
       this.signups.forEach(signup => {
           if (signup.id) {
               const initialValue = signup.adminFeedback || (signup.status === SignupStatus.CancelledByAdmin ? signup.adminCancellationReason : '') || '';
               this.feedbackForms[signup.id] = this.fb.group({
                   feedbackOrReason: [initialValue, [Validators.maxLength(500)]]
               });
           }
       });
   }

   manageStatus(signup: Signup, targetStatus: SignupStatus): void {
       if (!this.currentAdminId || !signup?.id) return;

       const signupId = signup.id;
       const form = this.feedbackForms[signupId];
       // Handle case where form might not be initialized yet (though unlikely with current logic)
       if (!form) {
            console.error("Form not found for signup ID:", signupId);
            this.statusUpdateError[signupId] = "Internal form error.";
            return;
       }

       const feedbackOrReasonControl = form.get('feedbackOrReason');
       const feedbackOrReason = feedbackOrReasonControl?.value?.trim() || null;

       // Reset validation errors first
        feedbackOrReasonControl?.setErrors(null);
        this.statusUpdateError[signupId] = '';

        // Require reason for Reject or Admin Cancel
        if ((targetStatus === SignupStatus.Rejected || targetStatus === SignupStatus.CancelledByAdmin) && !feedbackOrReason) {
            this.statusUpdateError[signupId] = 'A reason or feedback message is required for rejection or cancellation.';
            feedbackOrReasonControl?.markAsTouched();
            feedbackOrReasonControl?.setErrors({'required': true});
            return; // Stop if validation fails
        }

       this.statusUpdateLoading[signupId] = true;

       const request: AdminSignupUpdateRequest = {
           status: targetStatus,
           feedbackOrReason: feedbackOrReason
       };

       // Assuming manageSignupByAdmin exists in service and handles backend call
       this.signupService.manageSignupByAdmin(signupId, this.currentAdminId, request).subscribe({
          next: (updatedSignup: Signup) => {
             const index = this.signups.findIndex(s => s.id === signupId);
             if (index !== -1) {
                 this.signups[index] = updatedSignup;
                 this.feedbackForms[signupId]?.patchValue({ feedbackOrReason: updatedSignup.adminFeedback || updatedSignup.adminCancellationReason || '' });
                 this.feedbackForms[signupId]?.markAsPristine();
             }
              this.statusUpdateLoading[signupId] = false;
          },
          error: (err: HttpErrorResponse) => {
             this.statusUpdateError[signupId] = err.error?.message || err.error?.error || `Failed to update status to ${targetStatus}.`;
             this.statusUpdateLoading[signupId] = false;
             console.error(`Status update error for signup ${signupId}:`, err);
          }
       });
   }

   getStatusClass(status: SignupStatus | undefined): string { // Added undefined check
     switch (status) {
       case SignupStatus.Approved: return 'status-approved';
       case SignupStatus.Rejected: return 'status-rejected';
       case SignupStatus.CancelledByAdmin: return 'status-cancelled'; // Simplified cancelled class
       // case SignupStatus.CancelledByAdmin: return 'status-cancelled-admin';
       // case SignupStatus.CancelledByVolunteer: return 'status-cancelled-volunteer';
       case SignupStatus.Pending:
       default: return 'status-pending';
     }
   }

    // *** CORRECTED NAVIGATION PATH LOGIC ***
    viewVolunteerProfile(volunteerUserId: number | undefined): void {
        if (volunteerUserId) {
            // Use the exact path defined in app.routes.ts
            const targetPath = ['/app/admin/volunteer-profile', volunteerUserId];
            console.log('Admin navigating to Volunteer Profile:', targetPath);
            this.router.navigate(targetPath);
        } else {
            console.error("Cannot navigate: volunteerUserId is missing or invalid.", volunteerUserId);
            // Optionally show a user-facing error message here
            this.error = "Could not view profile: Volunteer ID missing.";
        }
    }

   goBack(): void {
       this.location.back();
   }
}