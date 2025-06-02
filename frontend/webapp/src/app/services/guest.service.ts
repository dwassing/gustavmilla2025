import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Guest } from '../models/guest.model';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${localStorage.getItem('token')}`,
      'accept': 'application/json'
    });
  }

  constructor(private http: HttpClient) {}

  getGuestPreferences(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${environment.backendBaseUrl}/getGuestPreferences`, {headers:  this.getHeaders()})
  }

  async setGuestPreferences(guests: Guest[]): Promise<boolean> {
    return lastValueFrom(this.http.post<boolean>(`${environment.backendBaseUrl}/setGuestPreferences`, guests, {headers:  this.getHeaders()}));
  }

  async removeGuest(guest: Guest): Promise<boolean> {
    const body = {
      guestId: guest.guestId,
      firstName: guest.firstName,
      lastName: guest.lastName
    }
    return lastValueFrom(this.http.post<boolean>(`${environment.backendBaseUrl}/removeGuest`, body, {headers:  this.getHeaders()}))
  }
}
