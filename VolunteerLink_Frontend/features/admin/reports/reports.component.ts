import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService } from '../../../core/services/event.service';
import { SignupService } from '../../../core/services/signup.service'; // Ensure SignupService is injected
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';
import { saveAs } from 'file-saver'; // Import file-saver library
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe,RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  adminEvents: Event[] = [];
  isLoading = true; // Changed initial state
  error: string | null = null;
  downloadError: { [eventId: number]: string } = {};
  downloadLoading: { [eventId: number]: boolean } = {};
  currentAdminId: number | null = null;

  private eventService = inject(EventService);
  private signupService = inject(SignupService); // Inject SignupService
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.currentAdminId = this.authService.getCurrentUserId();
    if (this.currentAdminId) {
      this.loadAdminEvents();
    } else {
        this.error = "Could not identify admin user.";
        this.isLoading = false;
    }
  }

  loadAdminEvents(): void {
    if (!this.currentAdminId) return;
    this.isLoading = true;
    this.error = null;
    this.eventService.getAdminEvents(this.currentAdminId).subscribe({
      next: (data) => {
        this.adminEvents = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your events.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // --- DOWNLOAD REPORT METHOD ---
  downloadReport(eventId: number | undefined, eventTitle: string | undefined): void {
    if (!eventId) {
        console.error("Event ID is missing for download.");
        return;
    }

    // Set loading state and clear previous errors for this specific event
    this.downloadError[eventId] = '';
    this.downloadLoading[eventId] = true;

    // Sanitize filename (optional but good practice)
    const safeTitle = eventTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'event';
    const filename = `event_${eventId}_${safeTitle}_participation.csv`;

    // Call the service method to download the report
    this.signupService.downloadEventReport(eventId).subscribe({
        next: (blob) => {
            // Use file-saver to trigger the download dialog in the browser
            saveAs(blob, filename);
            this.downloadLoading[eventId] = false; // Reset loading state on success
        },
        error: (err: HttpErrorResponse) => {
            this.downloadLoading[eventId] = false; // Reset loading state on error
            // Try to get a meaningful error message
            if (err.error instanceof Blob && err.error.type === "application/json") {
                 // If backend sent error details as JSON within the blob response
                 const reader = new FileReader();
                 reader.onload = (e: any) => {
                     try {
                        const errorResponse = JSON.parse(e.target.result);
                        this.downloadError[eventId!] = `Download Failed: ${errorResponse.message || 'Server error'}`;
                     } catch (parseError){
                        this.downloadError[eventId!] = `Download Failed: Could not parse error response. Status: ${err.status}`;
                     }
                 };
                 reader.readAsText(err.error);
             } else if (typeof err.error === 'string') { // If backend sent plain text error
                  this.downloadError[eventId!] = `Download Failed: ${err.error}`;
             } else { // Generic error
                 this.downloadError[eventId!] = `Download Failed. Status: ${err.status} - ${err.statusText}`;
             }
            console.error("Download Report Error:", err);
        }
    });
  }
  // --- END DOWNLOAD REPORT METHOD ---
}