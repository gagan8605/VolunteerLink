import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import { Event } from '../../core/models/event.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe,FormsModule], // Add DatePipe
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  upcomingEventsPreview: Event[] = [];
  isLoadingEvents = true;
  errorLoadingEvents: string | null = null;

  // Contact form data
  contactFormData = {
    name: '',
    phone: '',
    message: ''
  };

  // Inject services
  public authService = inject(AuthService); // Public for template access
  private eventService = inject(EventService);

  ngOnInit(): void {
    this.loadUpcomingEventsPreview();
  }

  loadUpcomingEventsPreview(): void {
    this.isLoadingEvents = true;
    this.errorLoadingEvents = null;
    this.eventService.getUpcomingEvents().subscribe({
      next: (data) => {
        // Take only the first few events for the preview (e.g., 3)
        this.upcomingEventsPreview = data.slice(0, 3);
        this.isLoadingEvents = false;
      },
      error: (err) => {
        this.errorLoadingEvents = 'Could not load upcoming events.';
        console.error('Error loading events preview:', err);
        this.isLoadingEvents = false;
      }
    });
  }

  // Handle contact form submission
  onSubmitContactForm(): void {
    console.log('Contact Form Submitted:', this.contactFormData);
    // Add logic to send the form data to a backend API or handle it as needed
    alert('Thank you for reaching out! We will get back to you soon.');
    // Reset the form data
    this.contactFormData = {
      name: '',
      phone: '',
      message: ''
    };
  }
}