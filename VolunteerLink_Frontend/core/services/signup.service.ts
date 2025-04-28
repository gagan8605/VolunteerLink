import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Signup, SignupRequest, VolunteerCancellationRequest, AdminSignupUpdateRequest } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrlBase = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  applyForEvent(request: SignupRequest): Observable<Signup> {
    return this.http.post<Signup>(`${this.apiUrlBase}/volunteer/signup`, request);
  }

  getMySignups(userId: number): Observable<Signup[]> {
    return this.http.get<Signup[]>(`${this.apiUrlBase}/volunteer/my-events/${userId}`);
  }

  cancelSignupByVolunteer(signupId: number, volunteerUserId: number, request: VolunteerCancellationRequest): Observable<Signup> {
    const params = new HttpParams().set('volunteerUserId', volunteerUserId.toString());
    return this.http.post<Signup>(`${this.apiUrlBase}/volunteer/signup/${signupId}/cancel`, request, { params });
  }

  getVolunteersForEvent(eventId: number): Observable<Signup[]> {
    return this.http.get<Signup[]>(`${this.apiUrlBase}/admin/events/${eventId}/volunteers`);
  }

  manageSignupByAdmin(signupId: number, adminId: number, request: AdminSignupUpdateRequest): Observable<Signup> {
    const params = new HttpParams().set('adminId', adminId.toString());
    return this.http.put<Signup>(`${this.apiUrlBase}/admin/signups/${signupId}/manage`, request, { params });
  }

   downloadEventReport(eventId: number): Observable<Blob> {
        return this.http.get(`${this.apiUrlBase}/admin/reports/event/${eventId}/csv`, {
            responseType: 'blob'
        });
    }
}