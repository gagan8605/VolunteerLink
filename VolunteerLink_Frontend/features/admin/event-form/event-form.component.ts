import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, Location, DatePipe } from '@angular/common'; // DatePipe provided globally or imported here
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  // DatePipe is provided globally in app.config.ts in this setup
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  @Input() id?: string; // For editing, bound from route

  eventForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;
  currentAdminId: number | null = null;
  pageTitle = 'Create New Event';

  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private datePipe = inject(DatePipe); // Injection works because it's provided globally

  constructor() {
      // Initialize the form with all fields, including new ones
      this.eventForm = this.fb.group({
          title: ['', Validators.required],
          date: ['', Validators.required], // Input type="datetime-local" binds to string
          location: [''],
          description: [''],
          salary: [0, [Validators.min(0)]], // Optional salary, non-negative
          organizerPhoneNumber: [''] // Optional phone number
      });
  }

  ngOnInit(): void {
      this.currentAdminId = this.authService.getCurrentUserId();
      if (!this.currentAdminId) {
          this.error = "Cannot proceed without admin user identification.";
          this.eventForm.disable(); // Prevent interaction if no admin ID
          return;
      }

      // Check if editing based on the presence of 'id' route parameter
      if (this.id) {
          this.isEditMode = true;
          this.pageTitle = 'Edit Event';
          const eventId = parseInt(this.id, 10);
          if (!isNaN(eventId)) {
              this.loadEventForEdit(eventId);
          } else {
              this.error = 'Invalid event ID for editing.';
               this.eventForm.disable();
          }
      }
      // No 'else' needed, form is already set for creation mode
  }

   loadEventForEdit(eventId: number): void {
       this.isLoading = true;
       this.error = null;
       this.eventService.getEventById(eventId).subscribe({
           next: (eventData) => {
               // Format date from backend (assuming ISO string or Date) for datetime-local input
               const formattedDate = this.datePipe.transform(eventData.date, 'yyyy-MM-ddTHH:mm');

               // Patch the form with fetched data
               this.eventForm.patchValue({
                   title: eventData.title,
                   date: formattedDate, // Use formatted date string
                   location: eventData.location,
                   description: eventData.description,
                   salary: eventData.salary, // Patch salary
                   organizerPhoneNumber: eventData.organizerPhoneNumber // Patch phone
               });
               this.isLoading = false;
           },
           error: (err) => {
               this.error = 'Failed to load event data for editing.';
               this.isLoading = false;
               this.eventForm.disable(); // Disable form if data loading fails
               console.error(err);
           }
       });
   }

   onSubmit(): void {
       this.error = null;
       if (this.eventForm.invalid || !this.currentAdminId) {
           this.eventForm.markAllAsTouched(); // Show validation errors
            this.error = 'Please fill in all required fields correctly.';
           return;
       }

       this.isLoading = true;
       // Construct the Event object from form values
       const eventData: Event = {
           // id is not included for create, and backend ignores it for update usually
           title: this.eventForm.value.title,
           date: this.eventForm.value.date, // Value from input is string in 'yyyy-MM-ddTHH:mm' format
           location: this.eventForm.value.location || null, // Send null if empty
           description: this.eventForm.value.description || null, // Send null if empty
           salary: this.eventForm.value.salary ?? 0, // Default to 0 if null/undefined
           organizerPhoneNumber: this.eventForm.value.organizerPhoneNumber || null // Send null if empty
       };


       if (this.isEditMode && this.id) {
           // --- Update Event ---
            const eventId = parseInt(this.id, 10);
           this.eventService.updateEvent(eventId, eventData, this.currentAdminId).subscribe({
               next: () => {
                   this.isLoading = false;
                   this.router.navigate(['/admin/manage-events']); // Navigate back on success
               },
               error: (err) => {
                   this.error = err.error?.message || err.error?.error || 'Failed to update event.';
                   this.isLoading = false;
                   console.error('Update error:', err);
               }
           });
       } else {
           // --- Create Event ---
           this.eventService.createEvent(eventData, this.currentAdminId).subscribe({
               next: () => {
                   this.isLoading = false;
                   this.router.navigate(['/admin/manage-events']); // Navigate back on success
               },
               error: (err) => {
                   this.error = err.error?.message || err.error?.error || 'Failed to create event.';
                   this.isLoading = false;
                   console.error('Create error:', err);
               }
           });
       }
   }

    // Function to navigate back
    cancel(): void {
        this.location.back();
    }
}