import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrlBase = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrlBase}/events/upcoming`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrlBase}/events/${id}`);
  }

  getAdminEvents(adminId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrlBase}/admin/my-events/${adminId}`);
  }

  createEvent(event: Event, adminId: number): Observable<Event> {
     const params = new HttpParams().set('adminId', adminId.toString());
    return this.http.post<Event>(`${this.apiUrlBase}/admin/events`, event, { params });
  }

  updateEvent(id: number, event: Event, adminId: number): Observable<Event> {
    const params = new HttpParams().set('adminId', adminId.toString());
    return this.http.put<Event>(`${this.apiUrlBase}/admin/events/${id}`, event, { params });
  }

  deleteEvent(id: number, adminId: number): Observable<void> {
    const params = new HttpParams().set('adminId', adminId.toString());
    return this.http.delete<void>(`${this.apiUrlBase}/admin/events/${id}`, { params });
  }
  searchEvents(location?: string | null, date?: string | null): Observable<Event[]> {
    let params = new HttpParams();
    if (location) {
        params = params.set('location', location);
    }
    if (date) {
        // Ensure date is in YYYY-MM-DD format if sending as string
        params = params.set('date', date);
    }
    return this.http.get<Event[]>(`${this.apiUrlBase}/events/search`, { params: params });
}

}