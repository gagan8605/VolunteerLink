import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SignupService } from '../../../core/services/signup.service';
import { AuthService } from '../../../core/services/auth.service';
import { Signup, SignupStatus, VolunteerCancellationRequest } from '../../../core/models/signup.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  mySignups: Signup[] = [];
  isLoading = true;
  error: string | null = null;
  currentUserId: number | null = null;
  SignupStatus = SignupStatus;

  cancelForms: { [signupId: number]: FormGroup } = {};
  cancelError: { [signupId: number]: string } = {};
  cancelLoading: { [signupId: number]: boolean } = {};
  showCancelForm: { [signupId: number]: boolean } = {};


  canCancelAnySignup: boolean = false;

  readonly CANCELLATION_WINDOW_HOURS = 12;

  private signupService = inject(SignupService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    if (this.currentUserId) {
      this.loadMySignups();
    } else {
      this.error = 'Could not identify user.';
      this.isLoading = false;
    }
  }

  loadMySignups(): void {
    if (!this.currentUserId) return;
    this.isLoading = true;
    this.error = null;
    this.mySignups = [];
    this.cancelForms = {};
    this.cancelError = {};
    this.cancelLoading = {};
    this.showCancelForm = {};
    this.canCancelAnySignup = false; // Reset before loading

    this.signupService.getMySignups(this.currentUserId).subscribe({
      next: (data) => {
        this.mySignups = data.sort((a, b) => {
            const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
            const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
            if (dateA === 0 && dateB === 0) return 0;
            if (dateA === 0) return 1;
            if (dateB === 0) return -1;
            return dateA - dateB;
        });
        this.initializeCancelForms();
       
        this.checkIfAnyCanBeCancelled();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your event signups.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  refreshEvents(): void {
      console.log('Refreshing events...');
      this.loadMySignups();
  }

  initializeCancelForms(): void {
      this.mySignups.forEach(signup => {
          if (signup.id) {
               this.cancelForms[signup.id] = this.fb.group({
                   reason: ['', Validators.required]
               });
               this.showCancelForm[signup.id] = this.showCancelForm[signup.id] || false;
               this.cancelLoading[signup.id] = this.cancelLoading[signup.id] || false;
               this.cancelError[signup.id] = this.cancelError[signup.id] || '';
          }
      });
  }

  // *** New method to calculate the boolean ***
  checkIfAnyCanBeCancelled(): void {
      this.canCancelAnySignup = this.mySignups.some(signup => this.canCancel(signup));
  }

  toggleCancelForm(signupId: number | undefined): void {
      if (signupId) {
          this.showCancelForm[signupId] = !this.showCancelForm[signupId];
           this.cancelError[signupId] = '';
           if (!this.showCancelForm[signupId]) {
               this.cancelForms[signupId]?.reset();
           }
      }
  }

   canCancel(signup: Signup): boolean {
       if (!signup?.id || !signup.eventDate) return false;
       if (signup.status !== SignupStatus.Approved) return false;

       const eventTime = new Date(signup.eventDate).getTime();
       const now = new Date().getTime();
       const hoursUntilEvent = (eventTime - now) / (1000 * 60 * 60);

       return hoursUntilEvent >= this.CANCELLATION_WINDOW_HOURS;
   }

   submitCancellation(signupId: number | undefined): void {
       if (!signupId || !this.currentUserId) return;

       const form = this.cancelForms[signupId];
       if (form.invalid) {
           this.cancelError[signupId] = 'A reason for cancellation is required.';
           form.markAllAsTouched();
           return;
       }

       this.cancelError[signupId] = '';
       this.cancelLoading[signupId] = true;

       const request: VolunteerCancellationRequest = {
           reason: form.get('reason')?.value
       };

       this.signupService.cancelSignupByVolunteer(signupId, this.currentUserId, request).subscribe({
           next: (updatedSignup) => {
               const index = this.mySignups.findIndex(s => s.id === signupId);
               if (index !== -1) {
                   this.mySignups[index] = updatedSignup;
               }
               // *** Re-calculate after cancellation update ***
               this.checkIfAnyCanBeCancelled();
               this.cancelLoading[signupId] = false;
               this.showCancelForm[signupId] = false;
               form.reset();
           },
           error: (err: HttpErrorResponse) => {
               this.cancelError[signupId] = err.error?.message || err.error?.error || 'Failed to cancel signup.';
               this.cancelLoading[signupId] = false;
               console.error('Cancellation error:', err);
           }
       });
   }

   getStatusClass(status: SignupStatus): string {
     switch (status) {
       case SignupStatus.Approved: return 'status-approved';
       case SignupStatus.Rejected: return 'status-rejected';
       case SignupStatus.CancelledByAdmin: return 'status-cancelled-admin';
       case SignupStatus.CancelledByVolunteer: return 'status-cancelled-volunteer';
       case SignupStatus.Pending:
       default: return 'status-pending';
     }
   }
}