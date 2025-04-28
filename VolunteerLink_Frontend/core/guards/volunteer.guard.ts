import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const volunteerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isVolunteer()) {
    return true;
  } else {
    console.warn('Volunteer access denied');
    router.navigate(['/events']);
    return false;
  }
};