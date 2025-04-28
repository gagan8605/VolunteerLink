import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Ensure Router is imported
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {
  adminEvents: Event[] = [];
  isLoading = true;
  error: string | null = null;
  deleteError: { [eventId: number]: string } = {};
  deleteLoading: { [eventId: number]: boolean } = {};
  currentAdminId: number | null = null;

  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router); // Router is injected

  ngOnInit(): void {
    this.currentAdminId = this.authService.getCurrentUserId();
    console.log('ManageEventsComponent loaded. Admin ID:', this.currentAdminId); // Debug Log
    if (this.currentAdminId) {
      this.loadAdminEvents();
    } else {
      this.error = 'Could not identify admin user.';
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

  deleteEvent(eventId: number | undefined): void {
    if (!eventId || !this.currentAdminId || !confirm('Are you sure you want to delete this event and all its signups? This action cannot be undone.')) {
        return;
    }
    this.deleteError[eventId] = '';
    this.deleteLoading[eventId] = true;
    this.eventService.deleteEvent(eventId, this.currentAdminId).subscribe({
        next: () => {
            this.adminEvents = this.adminEvents.filter(event => event.id !== eventId);
            console.log('Event deleted successfully:', eventId);
        },
        error: (err) => {
            this.deleteError[eventId] = 'Failed to delete event.';
            this.deleteLoading[eventId] = false;
            console.error('Delete error:', err);
        },
        // Ensure loading state is reset even on success if needed elsewhere, though removing the row handles it here.
        // complete: () => { this.deleteLoading[eventId] = false; }
    });
  }

  // --- FIX THE NAVIGATION PATHS HERE ---
  editEvent(eventId: number | undefined): void {
      if (eventId) {
          const targetPath = ['/app/admin/event/edit', eventId];
          console.log('Navigating to Edit:', targetPath); // Debug Log
          this.router.navigate(targetPath);
      }
  }

  viewVolunteers(eventId: number | undefined): void {
       if (eventId) {
           const targetPath = ['/app/admin/event', eventId, 'volunteers'];
           console.log('Navigating to View Volunteers:', targetPath); // Debug Log
          this.router.navigate(targetPath);
      }
  }

   addEvent(): void {
       const targetPath = ['/app/admin/event/new'];
       console.log('Navigating to Add New Event:', targetPath); // Debug Log
       this.router.navigate(targetPath);
   }
   // --- END OF FIX ---
}