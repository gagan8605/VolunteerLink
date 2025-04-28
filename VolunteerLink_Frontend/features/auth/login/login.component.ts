import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  private returnUrl: string = '/';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     if (this.authService.isLoggedIn()) {
         this.navigateToDashboard(this.authService.getCurrentUserRole());
     }
     this.route.queryParams.subscribe(params => {
       this.returnUrl = params['returnUrl'] || '/events';
     });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.navigateToDashboard(response.role);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
        this.authService.clearStoredUser();
      }
    });
  }

   private navigateToDashboard(role: Role | null): void {
        const defaultAdminRoute = '/admin';
        const defaultVolunteerRoute = '/events'; 

        if (role === Role.Admin) {
            const navigateTo = this.returnUrl.startsWith('/admin') ? this.returnUrl : defaultAdminRoute;
            this.router.navigateByUrl(navigateTo);
        } else if (role === Role.Volunteer) {
             const navigateTo = (this.returnUrl && this.returnUrl !== '/' && !this.returnUrl.startsWith('/auth')) ? this.returnUrl : defaultVolunteerRoute;
            this.router.navigateByUrl(navigateTo);
        } else {
             this.router.navigate(['/events']);
        }
    }
}