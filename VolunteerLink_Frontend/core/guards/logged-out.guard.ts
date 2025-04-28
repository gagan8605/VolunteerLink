import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

// This guard PREVENTS access to a route if the user IS logged in.
// It's used for pages like login, register, and the public landing page.
export const loggedOutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    // User is NOT logged in - Allow access to the route (e.g., landing, login, register)
    return true;
  } else {
    // User IS logged in - Prevent access and redirect them to their dashboard area

    const role = authService.getCurrentUserRole();
    // Determine where to redirect based on role
    const redirectPath = role === Role.Admin ? '/app/admin' : '/app/events'; // Or '/app/volunteer' if preferred for volunteers

    console.log(`LoggedOutGuard: User is logged in (Role: ${role}). Redirecting to ${redirectPath}`); // For debugging

    router.navigate([redirectPath]); // Perform the redirect
    return false; // Deny access to the current route (landing/login/register)
  }
};