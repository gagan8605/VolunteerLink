import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
// Import ReactiveFormsModule & FormBuilder/Group
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  // Add ReactiveFormsModule to imports
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  // State for Header
  isLoggedIn = false;
  isAdmin = false;
  isVolunteer = false;
  userName: string | null = null;
  userId: number | null = null;

  // Search Form
  searchForm: FormGroup;

  private authSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder); // Inject FormBuilder

  constructor() {
      // Initialize search form
      this.searchForm = this.fb.group({
          location: [''],
          date: [''] // Store date as string YYYY-MM-DD
      });
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === Role.Admin;
      this.isVolunteer = user?.role === Role.Volunteer;
      this.userName = user?.fullName || null;
      this.userId = user?.id || null;
    });

    // Clear search form if user logs out (optional)
    this.authService.currentUser$.pipe(filter(user => !user)).subscribe(() => {
        this.searchForm.reset({ location: '', date: ''});
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  // Method to handle search submission
  onSearchSubmit(): void {
      const location = this.searchForm.value.location?.trim() || null;
      const date = this.searchForm.value.date || null; // Already YYYY-MM-DD string

      // Construct query parameters, only include if value exists
      const queryParams: any = {};
      if (location) {
          queryParams.location = location;
      }
      if (date) {
          queryParams.date = date;
      }

      console.log("Navigating with search params:", queryParams);
      // Navigate to the events list page with query parameters
      this.router.navigate(['/app/events'], { queryParams: queryParams });
  }

  logout(): void {
    this.authService.logout();
  }
}