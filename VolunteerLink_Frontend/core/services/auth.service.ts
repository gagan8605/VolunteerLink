import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, Role, RegisterRequest, LoginRequest } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private platformId = inject(PLATFORM_ID);
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);

  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  private storeUser(user: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error storing user to localStorage', e);
         this.currentUserSubject.next(user);
      }
    } else {
       this.currentUserSubject.next(user);
    }
  }

  private getStoredUser(): LoginResponse | null {
    if (isPlatformBrowser(this.platformId)) {
        const user = localStorage.getItem('currentUser');
        try {
           return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error("Error parsing stored user", e);
            this.clearStoredUser();
            return null;
        }
    }
    return null;
  }

  clearStoredUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem('currentUser');
      } catch (e) {
         console.error('Error removing user from localStorage', e);
      }
    }
    this.currentUserSubject.next(null);
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.storeUser(user);
      })
    );
  }

  logout(): void {
    this.clearStoredUser();
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getCurrentUserId(): number | null {
      return this.currentUserValue ? this.currentUserValue.id : null;
  }

  getCurrentUserRole(): Role | null {
      return this.currentUserValue ? this.currentUserValue.role : null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === Role.Admin;
  }

  isVolunteer(): boolean {
      return this.currentUserValue?.role === Role.Volunteer;
  }
}